// 3d-viewer-module.js
// Modulær 3D viewer til .3mf filer med fuld farve-support

export class Model3DViewer {
    constructor(containerId, modelPath, options = {}) {
        this.containerId = containerId;
        this.modelPath = modelPath;
        this.options = {
            backgroundColor: options.backgroundColor || 0xf5f5f5,
            cameraDistance: options.cameraDistance || 150,
            autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
            showLoadingIndicator: options.showLoadingIndicator !== undefined ? options.showLoadingIndicator : true,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.animationId = null;
        
        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            console.error('THREE.js ikke fundet. Sørg for at inkludere Three.js biblioteket før dette modul.');
            return;
        }
        
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            console.error('JSZip ikke fundet. Sørg for at inkludere JSZip biblioteket før dette modul.');
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
        this.camera.position.set(0, 50, this.options.cameraDistance);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(1, 1, 1);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-1, -1, -1);
        this.scene.add(directionalLight2);

        // Simple orbit controls (mouse drag to rotate)
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
            console.log('Loading 3MF file:', this.modelPath);
            
            // Load 3MF file
            const response = await fetch(this.modelPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            console.log('3MF file loaded, size:', arrayBuffer.byteLength, 'bytes');
            
            // Parse 3MF file using JSZip
            const zip = new JSZip();
            const zipData = await zip.loadAsync(arrayBuffer);
            console.log('ZIP parsed, files:', Object.keys(zipData.files));
            
            // Parse the 3D model from 3MF
            const model3D = await this.parse3MF(zipData);
            
            this.model = model3D;
            this.scene.add(this.model);

            // Center and scale model
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            console.log('Model size:', size);
            console.log('Model center:', center);
            
            // Center model
            this.model.position.sub(center);
            
            // Scale to fit
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 100 / maxDim;
            this.model.scale.multiplyScalar(scale);

            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }

            console.log('3MF model loaded successfully with colors!');

        } catch (error) {
            console.error('Fejl ved indlæsning af 3D model:', error);
            if (loadingDiv) {
                loadingDiv.innerHTML = '<div style="color: #e74c3c; padding: 20px; text-align: center;"><strong>Kunne ikke indlæse 3D model</strong><br><small>' + error.message + '</small></div>';
            }
        }
    }

    async parse3MF(zip) {
        // Read 3D/3dmodel.model file from the 3MF archive
        const modelFile = zip.file('3D/3dmodel.model');
        if (!modelFile) {
            throw new Error('3dmodel.model ikke fundet i 3MF filen');
        }

        const xmlText = await modelFile.async('string');
        console.log('XML loaded, length:', xmlText.length);
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing error: ' + parserError.textContent);
        }

        // Parse resources (materials/colors)
        const materials = this.parse3MFMaterials(xmlDoc);
        console.log('Materials parsed:', Object.keys(materials).length);

        // Parse mesh objects
        const objects = xmlDoc.getElementsByTagName('object');
        console.log('Objects found:', objects.length);
        
        const group = new THREE.Group();

        for (let obj of objects) {
            if (obj.getAttribute('type') === 'model') {
                const mesh = this.parse3MFMesh(obj, materials);
                if (mesh) {
                    group.add(mesh);
                }
            }
        }

        if (group.children.length === 0) {
            throw new Error('Ingen mesh objekter fundet i 3MF filen');
        }

        return group;
    }

    parse3MFMaterials(xmlDoc) {
        const materials = {};
        const baseMaterials = xmlDoc.getElementsByTagName('basematerials');
        
        console.log('Base materials groups found:', baseMaterials.length);
        
        if (baseMaterials.length > 0) {
            const baseMaterialGroup = baseMaterials[0];
            const bases = baseMaterialGroup.getElementsByTagName('base');
            
            console.log('Base materials found:', bases.length);
            
            for (let i = 0; i < bases.length; i++) {
                const base = bases[i];
                const name = base.getAttribute('name');
                const displayColor = base.getAttribute('displaycolor');
                
                console.log(`Material ${i}: name="${name}", color="${displayColor}"`);
                
                if (displayColor) {
                    // Convert #RRGGBBAA or #RRGGBB to Three.js color
                    const colorHex = displayColor.substring(0, 7); // Remove alpha if present
                    materials[i] = new THREE.MeshStandardMaterial({
                        color: colorHex,
                        roughness: 0.5,
                        metalness: 0.1
                    });
                }
            }
        }

        // Default material if none specified
        if (Object.keys(materials).length === 0) {
            console.log('No materials found, using default');
            materials[0] = new THREE.MeshStandardMaterial({
                color: 0x667eea,
                roughness: 0.5,
                metalness: 0.1
            });
        }

        return materials;
    }

    parse3MFMesh(objElement, materials) {
        const meshElement = objElement.getElementsByTagName('mesh')[0];
        if (!meshElement) {
            console.warn('No mesh element found in object');
            return null;
        }

        const vertices = [];
        const triangles = [];

        // Parse vertices
        const verticesElement = meshElement.getElementsByTagName('vertices')[0];
        const vertexElements = verticesElement.getElementsByTagName('vertex');
        
        console.log('Vertices found:', vertexElements.length);
        
        for (let v of vertexElements) {
            const x = parseFloat(v.getAttribute('x'));
            const y = parseFloat(v.getAttribute('y'));
            const z = parseFloat(v.getAttribute('z'));
            vertices.push(new THREE.Vector3(x, y, z));
        }

        // Parse triangles
        const trianglesElement = meshElement.getElementsByTagName('triangles')[0];
        const triangleElements = trianglesElement.getElementsByTagName('triangle');
        
        console.log('Triangles found:', triangleElements.length);
        
        for (let t of triangleElements) {
            const v1 = parseInt(t.getAttribute('v1'));
            const v2 = parseInt(t.getAttribute('v2'));
            const v3 = parseInt(t.getAttribute('v3'));
            
            // Get material/color for this triangle
            const pid = t.getAttribute('pid') || t.getAttribute('p1') || '0';
            const materialIndex = parseInt(pid);
            
            triangles.push({ v1, v2, v3, materialIndex });
        }

        // Check if we need multiple materials (multi-color model)
        const uniqueMaterials = [...new Set(triangles.map(t => t.materialIndex))];
        console.log('Unique materials used:', uniqueMaterials);
        
        if (uniqueMaterials.length === 1) {
            // Single material mesh
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            
            for (let tri of triangles) {
                positions.push(
                    vertices[tri.v1].x, vertices[tri.v1].y, vertices[tri.v1].z,
                    vertices[tri.v2].x, vertices[tri.v2].y, vertices[tri.v2].z,
                    vertices[tri.v3].x, vertices[tri.v3].y, vertices[tri.v3].z
                );
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.computeVertexNormals();
            
            const material = materials[uniqueMaterials[0]] || materials[0];
            return new THREE.Mesh(geometry, material);
            
        } else {
            // Multi-material mesh - create separate mesh for each color
            const group = new THREE.Group();
            
            for (let matIndex of uniqueMaterials) {
                const geometry = new THREE.BufferGeometry();
                const positions = [];
                
                const filteredTriangles = triangles.filter(t => t.materialIndex === matIndex);
                console.log(`Material ${matIndex}: ${filteredTriangles.length} triangles`);
                
                for (let tri of filteredTriangles) {
                    positions.push(
                        vertices[tri.v1].x, vertices[tri.v1].y, vertices[tri.v1].z,
                        vertices[tri.v2].x, vertices[tri.v2].y, vertices[tri.v2].z,
                        vertices[tri.v3].x, vertices[tri.v3].y, vertices[tri.v3].z
                    );
                }
                
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.computeVertexNormals();
                
                const material = materials[matIndex] || materials[0];
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }
            
            return group;
        }
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
        }
    }
}