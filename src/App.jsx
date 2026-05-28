import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';
import { FaGraduationCap, FaCamera, FaHeart, FaAppleAlt, FaQuoteRight, FaFacebookF, FaYoutube, FaInstagram, FaGlobeAmericas } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- 3D Background Components ---

const FloatingObjects = () => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#FFB74D" />
      <Environment preset="city" />
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[2, 1, -2]} scale={1.2}>
          <MeshDistortMaterial color="#FFB74D" attach="material" distort={0.4} speed={2} roughness={0.1} metalness={0.8} />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[1, 64, 64]} position={[-3, -1, -3]} scale={0.8}>
          <MeshDistortMaterial color="#FF9800" attach="material" distort={0.3} speed={1.5} roughness={0.2} metalness={0.7} />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[1, 64, 64]} position={[3, -2, -1]} scale={0.6}>
          <MeshDistortMaterial color="#81C784" attach="material" distort={0.5} speed={3} roughness={0.1} metalness={0.9} />
        </Sphere>
      </Float>

      <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={4} />
    </>
  );
};

const MouseParallaxCamera = () => {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// --- Custom Hooks ---

const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        countRef.current = window.requestAnimationFrame(step);
      }
    };
    countRef.current = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(countRef.current);
  }, [end, duration, start]);

  return count;
};

// --- Sub-components ---

const StatItem = ({ end, suffix, label }) => {
  const count = useCounter(end, 2500);
  return (
    <div className="stat-item">
      <h3>{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
};

const TiltCard = ({ children, bgClass }) => {
  const cardRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef}
      className={`curriculum-card ${bgClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease-out' }}
    >
      {children}
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Custom Cursor
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  // GSAP Refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const curriculumRef = useRef(null);

  useEffect(() => {
    // Simulate Loading
    setTimeout(() => setLoading(false), 2500);

    // Scroll Header
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Custom Cursor logic
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.left = `${clientX}px`;
        cursorDotRef.current.style.top = `${clientY}px`;
        
        cursorOutlineRef.current.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      // GSAP Animations
      gsap.fromTo('.stat-item', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } }
      );

      gsap.fromTo('.curriculum-card',
        { y: 100, opacity: 0, rotationX: 20 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: curriculumRef.current, start: 'top 75%' } }
      );
      
      gsap.fromTo('.feature-item',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.features', start: 'top 70%' } }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2 className="loading-text">TRÍ TÂM</h2>
      </div>
    );
  }

  const galleryImages = [
    "https://images.unsplash.com/photo-1543854589-9ebba41b02ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503676382389-0ea608b6b107?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587691592099-24045742c181?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603354350317-6f7ab20665be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>

      {/* Floating Shapes for background */}
      <div className="floating-shape" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--pastel-yellow)' }}></div>
      <div className="floating-shape" style={{ top: '60%', right: '5%', width: '400px', height: '400px', background: 'var(--pastel-orange)' }}></div>
      <div className="floating-shape" style={{ top: '40%', left: '40%', width: '250px', height: '250px', background: 'var(--light-green)' }}></div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="nav-logo">
            <span style={{ fontSize: '32px' }}>✨</span> Trí Tâm
          </a>
          <ul className="nav-links">
            <li><a href="#home">Trang chủ</a></li>
            <li><a href="#curriculum">Chương trình</a></li>
            <li><a href="#about">Vì sao chọn</a></li>
            <li><a href="#gallery">Thư viện</a></li>
          </ul>
          <div className="nav-buttons">
            <a href="#contact" className="btn-primary">Đăng ký tham quan</a>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" ref={heroRef}>
        <div className="hero-canvas-container">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <FloatingObjects />
              <MouseParallaxCamera />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="container">
          <motion.div 
            className="hero-content glass"
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ padding: '50px', borderRadius: '30px', perspective: '1000px' }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Nuôi dưỡng tuổi thơ <br/> bằng yêu thương
            </motion.h1>
            <motion.p 
              className="hero-slogan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Trường Mẫu Giáo Trí Tâm - Nơi khởi đầu hoàn hảo cho hành trình khám phá thế giới của bé.
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <a href="#contact" className="btn-primary">Đăng ký tham quan miễn phí</a>
              <a href="#curriculum" className="btn-secondary">Tìm hiểu thêm</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container" style={{ position: 'relative' }}>
        <div className="stats" ref={statsRef}>
          <StatItem end={15} suffix="+" label="Năm kinh nghiệm" />
          <StatItem end={50} suffix="+" label="Giáo viên tâm huyết" />
          <StatItem end={1000} suffix="+" label="Trẻ em theo học" />
          <StatItem end={100} suffix="%" label="Phụ huynh hài lòng" />
        </div>
      </div>

      {/* Curriculum Section */}
      <section id="curriculum" ref={curriculumRef}>
        <div className="container">
          <h2 className="section-title">Chương Trình Học</h2>
          <p className="section-subtitle">Phương pháp giáo dục tiên tiến, thiết kế riêng biệt phù hợp với từng giai đoạn phát triển của trẻ.</p>
          
          <div className="curriculum-grid">
            <TiltCard bgClass="curriculum-card-bg-1">
              <div className="card-icon"><FaHeart /></div>
              <h3>Nhà trẻ (12 - 36 tháng)</h3>
              <p>Phát triển thể chất, ngôn ngữ và cảm xúc thông qua các hoạt động vui chơi tương tác an toàn và yêu thương.</p>
            </TiltCard>
            <TiltCard bgClass="curriculum-card-bg-2">
              <div className="card-icon"><FaGraduationCap /></div>
              <h3>Mẫu giáo bé (3 - 4 tuổi)</h3>
              <p>Khám phá thế giới xung quanh, rèn luyện kỹ năng tự lập và khơi dậy tiềm năng sáng tạo bẩm sinh của bé.</p>
            </TiltCard>
            <TiltCard bgClass="curriculum-card-bg-3">
              <div className="card-icon"><FaGlobeAmericas /></div>
              <h3>Mẫu giáo lớn (5 - 6 tuổi)</h3>
              <p>Trang bị kiến thức tiền tiểu học, làm quen tiếng Anh quốc tế và hoàn thiện kỹ năng giao tiếp xã hội.</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features">
        <div className="container">
          <h2 className="section-title">Vì Sao Chọn Trí Tâm?</h2>
          <p className="section-subtitle">Môi trường giáo dục an toàn, hiện đại và tràn ngập tình yêu thương.</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><FaCamera /></div>
              <div className="feature-content">
                <h4>Camera Giám Sát 24/7</h4>
                <p>Hệ thống camera an ninh độ nét cao toàn diện, giúp ba mẹ an tâm theo dõi con mọi lúc mọi nơi.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FaHeart /></div>
              <div className="feature-content">
                <h4>Giáo Viên Tận Tâm</h4>
                <p>Đội ngũ giáo viên giàu kinh nghiệm, đạt chuẩn sư phạm, luôn yêu thương và kiên nhẫn với trẻ.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FaGlobeAmericas /></div>
              <div className="feature-content">
                <h4>Tiếng Anh Quốc Tế</h4>
                <p>Chương trình song ngữ với giáo viên bản xứ, giúp trẻ phát âm chuẩn và phản xạ tự nhiên từ nhỏ.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FaAppleAlt /></div>
              <div className="feature-content">
                <h4>Dinh Dưỡng Khoa Học</h4>
                <p>Thực đơn đa dạng, cân bằng dinh dưỡng, nguồn thực phẩm hữu cơ an toàn được kiểm định nghiêm ngặt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <div className="container">
          <h2 className="section-title">Khoảnh Khắc Đáng Yêu</h2>
          <p className="section-subtitle">Nụ cười của bé là niềm hạnh phúc lớn nhất của chúng tôi.</p>
          
          <div className="gallery-grid">
            {galleryImages.map((src, index) => (
              <motion.div 
                key={index}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={src} alt={`Gallery image ${index + 1}`} loading="lazy" />
                <div className="gallery-overlay">
                  <h4 className="gallery-text">Trí Tâm Kindergarten</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Phụ Huynh Nói Gì?</h2>
          
          <div className="testimonial-slider">
            <motion.div 
              className="testimonial-card"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"Bé nhà mình từ khi đi học ở Trí Tâm đã ngoan hơn, tự lập hơn rất nhiều. Cô giáo tận tình, cơ sở vật chất tuyệt vời!"</p>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Mẹ bé Misa" className="author-img" />
                <div className="author-info">
                  <h5>Chị Mai Anh</h5>
                  <p>Mẹ bé Misa (Lớp Nhà trẻ)</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="testimonial-card"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"Mình cực kỳ an tâm khi xem camera thấy con ăn ngủ ngoan. Chương trình tiếng Anh cũng rất hay, con phản xạ tự nhiên."</p>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Ba bé Ken" className="author-img" />
                <div className="author-info">
                  <h5>Anh Hoàng Tuấn</h5>
                  <p>Ba bé Ken (Lớp Mẫu giáo lớn)</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="testimonial-card"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"Môi trường học tập thân thiện, thực đơn phong phú giúp bé nhà mình ăn ngon miệng hơn. Cảm ơn các cô rất nhiều."</p>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Mẹ bé Su" className="author-img" />
                <div className="author-info">
                  <h5>Chị Lan Hương</h5>
                  <p>Mẹ bé Su (Lớp Mẫu giáo bé)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-box"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h2>Bắt Đầu Hành Trình Cùng Bé Yêu!</h2>
            <p>Để lại thông tin để nhận tư vấn chi tiết và tham quan trường miễn phí cùng vô vàn ưu đãi học phí hấp dẫn.</p>
            <a href="#" className="btn-white">Đăng ký tham quan ngay</a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <a href="#" className="nav-logo">
                <span style={{ fontSize: '28px' }}>✨</span> Trí Tâm
              </a>
              <p>Trường mầm non tiên phong ứng dụng phương pháp giáo dục hiện đại, mang đến môi trường an toàn và yêu thương cho trẻ.</p>
              <div className="social-icons">
                <a href="#" className="social-icon"><FaFacebookF /></a>
                <a href="#" className="social-icon"><FaYoutube /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Liên Kết</h4>
              <ul>
                <li><a href="#home">Trang chủ</a></li>
                <li><a href="#curriculum">Chương trình học</a></li>
                <li><a href="#about">Tuyển sinh</a></li>
                <li><a href="#contact">Liên hệ</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Thông Tin</h4>
              <ul>
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#">Cơ sở vật chất</a></li>
                <li><a href="#">Thực đơn dinh dưỡng</a></li>
                <li><a href="#">Tin tức & Sự kiện</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Liên Hệ</h4>
              <ul>
                <li style={{ color: 'var(--text-secondary)' }}>📍 123 Đường Tương Lai, Quận 1, TP.HCM</li>
                <li style={{ color: 'var(--text-secondary)' }}>📞 0123 456 789</li>
                <li style={{ color: 'var(--text-secondary)' }}>✉️ tuyensinh@tritam.edu.vn</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 Trí Tâm Kindergarten. Đã đăng ký bản quyền. Thiết kế với 💖.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
