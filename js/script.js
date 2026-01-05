// Initialize Three.js Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Chair Material Colors
        const chairColors = {
            purple: 0x6a11cb,
            blue: 0x2575fc,
            green: 0x2E8B57,
            red: 0xFF6347
        };

        // Create Ergonomic Chair
        function createChair() {
            const chairGroup = new THREE.Group();
            
            // Chair Base
            const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.2, 32);
            const baseMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            chairGroup.add(base);

            // Chair Pillar
            const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 16);
            const pillar = new THREE.Mesh(pillarGeometry, baseMaterial);
            pillar.position.y = 0.9;
            chairGroup.add(pillar);

            // Seat
            const seatGeometry = new THREE.BoxGeometry(1.8, 0.2, 1.5);
            const seatMaterial = new THREE.MeshStandardMaterial({ 
                color: chairColors.purple,
                roughness: 0.4
            });
            const seat = new THREE.Mesh(seatGeometry, seatMaterial);
            seat.position.y = 1.7;
            chairGroup.add(seat);

            // Backrest
            const backrestGeometry = new THREE.BoxGeometry(1.6, 1.2, 0.15);
            const backrestMaterial = new THREE.MeshStandardMaterial({ 
                color: chairColors.purple,
                roughness: 0.4
            });
            const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
            backrest.position.set(0, 2.5, -0.6);
            chairGroup.add(backrest);

            // Headrest
            const headrestGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.1);
            const headrest = new THREE.Mesh(headrestGeometry, backrestMaterial);
            headrest.position.set(0, 3.1, -0.6);
            chairGroup.add(headrest);

            // Armrests
            const armrestGeometry = new THREE.BoxGeometry(0.15, 0.3, 1);
            const armrestMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x222222,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const armrestLeft = new THREE.Mesh(armrestGeometry, armrestMaterial);
            armrestLeft.position.set(-0.9, 1.9, 0);
            chairGroup.add(armrestLeft);

            const armrestRight = new THREE.Mesh(armrestGeometry, armrestMaterial);
            armrestRight.position.set(0.9, 1.9, 0);
            chairGroup.add(armrestRight);

            return { chairGroup, seatMaterial, backrestMaterial };
        }

        const { chairGroup, seatMaterial, backrestMaterial } = createChair();
        scene.add(chairGroup);

        // Animation Variables
        let chairRotation = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Mouse Movement Interaction
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        });

        // GSAP Animations on Scroll
        gsap.registerPlugin(ScrollTrigger);

        // Animate chair on scroll
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
                chairGroup.rotation.y = self.progress * Math.PI * 2;
                chairGroup.position.y = Math.sin(self.progress * Math.PI) * 0.5;
            }
        });

        // Feature cards animation
        gsap.utils.toArray('.feature-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: i * 0.2
            });
        });

        // Scroll Progress Bar
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            document.querySelector('.scroll-progress').style.width = scrollPercent + '%';
        });

        // Chair Color Customizer
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const color = parseInt(button.dataset.color);
                seatMaterial.color.setHex(color);
                backrestMaterial.color.setHex(color);
                
                // Animation effect
                gsap.to(chairGroup.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });
        });

        // CTA Button Hover Effect
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3
                });
            });
        });

        // Window Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Smooth mouse following
            chairGroup.rotation.x += (mouseY * 0.05 - chairGroup.rotation.x) * 0.05;
            chairGroup.rotation.y += (mouseX * 0.05 - chairGroup.rotation.y) * 0.05;
            
            // Continuous subtle rotation
            chairGroup.rotation.y += 0.002;
            
            // Bouncing animation
            chairGroup.position.y = Math.sin(Date.now() * 0.001) * 0.05;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();

        // Initial animation
        gsap.from('.hero-content', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from(chairGroup.scale, {
            duration: 2,
            x: 0,
            y: 0,
            z: 0,
            ease: 'elastic.out(1, 0.5)'
        });
