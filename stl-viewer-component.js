/**
 * STL Viewer Component for TechBoks
 * Genbrugelig 3D viewer til at vise STL filer på produktsider
 */

class STLViewer {
    constructor(options) {
        this.container = typeof options.container === 'string' 
            ? document.querySelector(options.container) 
            : options.container;
        
        if (!this.container) {
            console.error('STLViewer: Container not found');
            return;
        }

        this.options = {
            stlPath: options.stlPath || '',
            autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
            color: options.color || '#667eea',
            width: options.width || '100%',
            height: options.height || '300px',
            backgroundColor: options.backgroundColor || '#f5f5f5',
            rotationSpeed: options.rotationSpeed || 0.005
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = {
            autoRotate: this.options.autoRotate,
            rotationSpeed: this.options.rotationSpeed,
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            rotation: { x: 0, y: 0 }
        };

        this.init();
    }

    init() {
        this.setupContainer();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.animate();
        
        if (this.options.stlPath) {
            this.loadSTL(this.options.stlPath);
        }
    }

    setupContainer() {
        this.container.style.width = this.options.width;
        this.container.style.height = this.options.height;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.borderRadius = '10px';
        
        // Loading indicator
        this.loadingDiv = document.createElement('div');
        this.loadingDiv.className = 'stl-loading';
        this.loadingDiv.innerHTML = `
            <div class="stl-spinner"></div>
            <div class="stl-loading-text">Indlæser 3D model...</div>
        `;
        this.loadingDiv.style.display = 'none';
        this.container.appendChild(this.loadingDiv);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
    }

    setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 150);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(1, 1, 1);
        this.scene.add(directionalLight1);
        
        // Fill light from opposite side
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-1, -1, -1);
        this.scene.add(directionalLight2);
        
        // Top light
        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 1, 0);
        this.scene.add(topLight);
    }

    setupControls() {
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            this.controls.isDragging = true;
            this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (this.controls.isDragging && this.model) {
                const deltaX = e.clientX - this.controls.previousMousePosition.x;
                const deltaY = e.clientY - this.controls.previousMousePosition.y;
                
                this.controls.rotation.y += deltaX * 0.01;
                this.controls.rotation.x += deltaY * 0.01;
                
                this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            this.controls.isDragging = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.controls.isDragging = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z += e.deltaY * 0.1;
            this.camera.position.z = Math.max(50, Math.min(300, this.camera.position.z));
        }, { passive: false });

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.model) {
            if (this.controls.autoRotate && !this.controls.isDragging) {
                this.controls.rotation.y += this.controls.rotationSpeed;
            }
            this.model.rotation.x = this.controls.rotation.x;
            this.model.rotation.y = this.controls.rotation.y;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    async loadSTL(url) {
        this.showLoading();
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('STL file not found');
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const geometry = this.parseSTL(arrayBuffer);
            
            if (this.model) {
                this.scene.remove(this.model);
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: this.options.color,
                specular: 0x111111,
                shininess: 200,
                flatShading: false
            });
            
            this.model = new THREE.Mesh(geometry, material);
            
            // Center and scale model
            geometry.computeBoundingBox();
            const center = new THREE.Vector3();
            geometry.boundingBox.getCenter(center);
            this.model.position.sub(center);
            
            const size = new THREE.Vector3();
            geometry.boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 100 / maxDim;
            this.model.scale.setScalar(scale);
            
            this.scene.add(this.model);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading STL:', error);
            this.showError();
        }
    }

    parseSTL(arrayBuffer) {
        const view = new DataView(arrayBuffer);
        const isASCII = this.isASCIISTL(arrayBuffer);
        
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
        const faces = view.getUint32(80, true);
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        
        for (let i = 0; i < faces; i++) {
            const offset = 84 + i * 50;
            
            // Normal
            const nx = view.getFloat32(offset, true);
            const ny = view.getFloat32(offset + 4, true);
            const nz = view.getFloat32(offset + 8, true);
            
            // Vertices
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
        const text = new TextDecoder().decode(arrayBuffer);
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        
        const vertexPattern = /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
        const normalPattern = /normal\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
        
        let match;
        const normalMatches = [];
        while ((match = normalPattern.exec(text)) !== null) {
            normalMatches.push([
                parseFloat(match[1]),
                parseFloat(match[3]),
                parseFloat(match[5])
            ]);
        }
        
        let faceIndex = 0;
        let vertexCount = 0;
        while ((match = vertexPattern.exec(text)) !== null) {
            vertices.push(
                parseFloat(match[1]),
                parseFloat(match[3]),
                parseFloat(match[5])
            );
            
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

    showLoading() {
        if (this.loadingDiv) {
            this.loadingDiv.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingDiv) {
            this.loadingDiv.style.display = 'none';
        }
    }

    showError() {
        this.hideLoading();
        this.container.innerHTML += `
            <div class="stl-error">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">⚠️</div>
                <div>Kunne ikke indlæse 3D model</div>
            </div>
        `;
    }

    setColor(color) {
        this.options.color = color;
        if (this.model) {
            this.model.material.color.setStyle(color);
        }
    }

    setAutoRotate(enabled) {
        this.controls.autoRotate = enabled;
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.loadingDiv) {
            this.container.removeChild(this.loadingDiv);
        }
    }
}

// Make it available globally
window.STLViewer = STLViewer;