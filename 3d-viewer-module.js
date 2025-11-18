// 3d-viewer-module.js
// Modulær 3D viewer til STL filer med Three.js

export class Model3DViewer {
    constructor(containerId, modelPath, options = {}) {
        this.containerId = containerId;
        this.modelPath = modelPath;
        this.options = {
            backgroundColor: options.backgroundColor || 0xf5f5f5,
            cameraDistance: options.cameraDistance || 150,
            autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
            modelColor: options.modelColor || 0x667eea,
            showLoadingIndicator: options.showLoadingIndicator !== undefined ? options.showLoadingIndicator : true,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.animationId = null;
        
        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            console.error('THREE.js blev ikke fundet. Sørg for at inkludere Three.js biblioteket før dette modul.');
            return;
        }
        
        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container med ID '${this.containerId}' blev ikke fundet`);
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);

        // Camera
        const aspect = container.clientWidth / container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
        this.camera.position.set(0, 0, this.options.cameraDistance);
        this.camera.lookAt(0, 0, 0); // Look at center

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Lighting - better positioned for centered model
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(100, 100, 100);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-100, -100, -100);
        this.scene.add(directionalLight2);
        
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight3.position.set(0, -100, 0);
        this.scene.add(directionalLight3);

        // Setup controls
        this.setupControls();

        // Load model
        this.loadModel();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    setupControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotation = { x: 0, y: 0 };

        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging || !this.model) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;

            this.model.rotation.y = rotation.y;
            this.model.rotation.x = rotation.x;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // Touch controls for mobile
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDragging || !this.model || e.touches.length !== 1) return;
            e.preventDefault();

            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;

            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;

            this.model.rotation.y = rotation.y;
            this.model.rotation.x = rotation.x;

            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Zoom with mouse wheel
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            this.camera.position.z += e.deltaY * zoomSpeed;
            this.camera.position.z = Math.max(50, Math.min(300, this.camera.position.z));
        });
    }

    async loadModel() {
        const container = document.getElementById(this.containerId);
        const loadingDiv = container.querySelector('.loading-indicator');

        try {
            console.log('🔄 Loading STL file:', this.modelPath);
            
            // Load STL file
            const response = await fetch(this.modelPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            console.log('✅ STL file loaded, size:', arrayBuffer.byteLength, 'bytes');
            
            // Parse STL
            const geometry = this.parseSTL(arrayBuffer);
            console.log('✅ STL parsed, vertices:', geometry.attributes.position.count);
            
            // Compute geometry properties FIRST
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            geometry.computeVertexNormals();
            
            // Create material
            const material = new THREE.MeshPhongMaterial({
                color: this.options.modelColor,
                specular: 0x111111,
                shininess: 200,
                side: THREE.DoubleSide
            });
            
            // Create mesh
            this.model = new THREE.Mesh(geometry, material);
            
            // Get bounding box info
            const boundingBox = geometry.boundingBox;
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            
            console.log('📐 Model original size:', size);
            console.log('📍 Model original center:', center);
            
            // CENTER THE MODEL AT ORIGIN (0,0,0)
            // Method 1: Translate geometry vertices
            geometry.translate(-center.x, -center.y, -center.z);
            
            // Recompute after translation
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            
            // Now model position is at origin
            this.model.position.set(0, 0, 0);
            
            // SCALE MODEL TO FIT NICELY
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 100; // Target size in scene units
            const scale = targetSize / maxDim;
            this.model.scale.setScalar(scale);
            
            console.log('📏 Applied scale:', scale);
            console.log('📍 Final position:', this.model.position);
            
            // Add to scene
            this.scene.add(this.model);
            
            // Adjust camera to fit model perfectly
            this.fitCameraToModel();

            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }

            console.log('✅ STL model loaded and centered successfully!');

        } catch (error) {
            console.error('❌ Fejl ved indlæsning af STL model:', error);
            if (loadingDiv) {
                loadingDiv.innerHTML = '<div style="color: #e74c3c; padding: 20px; text-align: center;"><strong>❌ Kunne ikke indlæse 3D model</strong><br><small>' + error.message + '</small></div>';
            }
        }
    }

    fitCameraToModel() {
        if (!this.model) return;
        
        // Get the bounding sphere for best camera positioning
        const boundingSphere = this.model.geometry.boundingSphere;
        const radius = boundingSphere.radius * this.model.scale.x; // Account for scale
        
        // Calculate ideal camera distance
        const fov = this.camera.fov * (Math.PI / 180);
        const distance = Math.abs(radius / Math.sin(fov / 2)) * 1.2; // 1.2 = padding factor
        
        console.log('📷 Camera distance calculated:', distance);
        
        // Position camera
        this.camera.position.set(0, radius * 0.5, distance);
        this.camera.lookAt(0, 0, 0);
        
        console.log('📷 Camera positioned at:', this.camera.position);
    }

    parseSTL(arrayBuffer) {
        const view = new DataView(arrayBuffer);
        const isASCII = this.isASCIISTL(arrayBuffer);
        
        console.log('📄 STL format:', isASCII ? 'ASCII' : 'Binary');
        
        if (isASCII) {
            return this.parseASCIISTL(arrayBuffer);
        } else {
            return this.parseBinarySTL(view);
        }
    }

    isASCIISTL(arrayBuffer) {
        const view = new Uint8Array(arrayBuffer);
        const text = String.fromCharCode.apply(null, view.slice(0, 80));
        return text.toLowerCase().indexOf('solid') === 0;
    }

    parseBinarySTL(view) {
        // Binary STL format:
        // 80 bytes header
        // 4 bytes number of triangles
        // For each triangle:
        //   - 12 bytes normal (3x float32)
        //   - 36 bytes vertices (3x 3x float32)
        //   - 2 bytes attribute byte count (unused)
        
        const faces = view.getUint32(80, true); // little-endian
        console.log('🔺 Triangles:', faces);
        
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        
        for (let i = 0; i < faces; i++) {
            const offset = 84 + i * 50;
            
            // Read normal
            const nx = view.getFloat32(offset, true);
            const ny = view.getFloat32(offset + 4, true);
            const nz = view.getFloat32(offset + 8, true);
            
            // Read 3 vertices
            for (let j = 0; j < 3; j++) {
                const vOffset = offset + 12 + j * 12;
                vertices.push(
                    view.getFloat32(vOffset, true),
                    view.getFloat32(vOffset + 4, true),
                    view.getFloat32(vOffset + 8, true)
                );
                normals.push(nx, ny, nz);
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        
        return geometry;
    }

    parseASCIISTL(arrayBuffer) {
        // ASCII STL format:
        // solid name
        //   facet normal nx ny nz
        //     outer loop
        //       vertex x y z
        //       vertex x y z
        //       vertex x y z
        //     endloop
        //   endfacet
        // endsolid
        
        const text = new TextDecoder().decode(arrayBuffer);
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        
        // Regex patterns
        const vertexPattern = /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
        const normalPattern = /normal\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
        
        // Parse normals
        let match;
        const normalMatches = [];
        while ((match = normalPattern.exec(text)) !== null) {
            normalMatches.push([
                parseFloat(match[1]),
                parseFloat(match[3]),
                parseFloat(match[5])
            ]);
        }
        
        console.log('🔺 Faces:', normalMatches.length);
        
        // Parse vertices
        let faceIndex = 0;
        let vertexCount = 0;
        while ((match = vertexPattern.exec(text)) !== null) {
            vertices.push(
                parseFloat(match[1]),
                parseFloat(match[3]),
                parseFloat(match[5])
            );
            
            // Apply normal for this face
            if (normalMatches[faceIndex]) {
                normals.push(...normalMatches[faceIndex]);
            }
            
            vertexCount++;
            if (vertexCount % 3 === 0) {
                faceIndex++;
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        
        return geometry;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Auto-rotation
        if (this.model && this.options.autoRotate) {
            this.model.rotation.y += 0.005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        // Cleanup
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById(this.containerId);
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
        }
        if (this.model) {
            this.scene.remove(this.model);
            if (this.model.geometry) {
                this.model.geometry.dispose();
            }
            if (this.model.material) {
                this.model.material.dispose();
            }
        }
    }
}