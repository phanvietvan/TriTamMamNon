import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Capsule, MeshDistortMaterial, Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import { FaGraduationCap, FaCamera, FaHeart, FaAppleAlt, FaQuoteRight, FaFacebookF, FaYoutube, FaInstagram, FaGlobeAmericas } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- 3D MASCOT: Cute Teddy Bear ---
const CuteBear = () => {
  const group = useRef();
  const leftArm = useRef();
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Floating motion
    group.current.position.y = Math.sin(t * 2) * 0.1;
    
    // Looking at mouse
    const targetX = (pointer.x * 0.5);
    const targetY = (pointer.y * 0.5);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.1);
    
    // Waving hand
    leftArm.current.rotation.z = Math.sin(t * 5) * 0.5 - 0.5;
  });

  const bodyColor = "#FFB74D";
  const bellyColor = "#FFE0B2";

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={0.7}>
      {/* Head */}
      <Sphere args={[0.8, 64, 64]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color={bodyColor} roughness={0.6} />
      </Sphere>
      
      {/* Muzzle */}
      <Sphere args={[0.3, 32, 32]} position={[0, 1.1, 0.75]} scale={[1.2, 0.9, 1]}>
        <meshStandardMaterial color={bellyColor} />
      </Sphere>
      
      {/* Nose */}
      <Sphere args={[0.08, 16, 16]} position={[0, 1.15, 1.02]}>
        <meshStandardMaterial color="#333" />
      </Sphere>

      {/* Eyes */}
      <Sphere args={[0.08, 16, 16]} position={[-0.3, 1.35, 0.65]}>
        <meshStandardMaterial color="#333" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.3, 1.35, 0.65]}>
        <meshStandardMaterial color="#333" />
      </Sphere>

      {/* Blush */}
      <Sphere args={[0.15, 16, 16]} position={[-0.45, 1.15, 0.6]} scale={[1, 0.5, 0.1]}>
        <meshStandardMaterial color="#FF5252" opacity={0.5} transparent />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.45, 1.15, 0.6]} scale={[1, 0.5, 0.1]}>
        <meshStandardMaterial color="#FF5252" opacity={0.5} transparent />
      </Sphere>

      {/* Ears */}
      <Sphere args={[0.3, 32, 32]} position={[-0.6, 1.7, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[-0.6, 1.7, 0.15]} scale={[1, 1, 0.2]}>
        <meshStandardMaterial color={bellyColor} />
      </Sphere>

      <Sphere args={[0.3, 32, 32]} position={[0.6, 1.7, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.6, 1.7, 0.15]} scale={[1, 1, 0.2]}>
        <meshStandardMaterial color={bellyColor} />
      </Sphere>

      {/* Body */}
      <Capsule args={[0.6, 0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Capsule>
      <Capsule args={[0.4, 0.6, 32, 32]} position={[0, 0.1, 0.25]} scale={[1, 1, 0.5]}>
        <meshStandardMaterial color={bellyColor} />
      </Capsule>

      {/* Arms */}
      <group position={[-0.7, 0.4, 0]} ref={leftArm}>
        <Capsule args={[0.2, 0.6, 16, 16]} position={[0, -0.4, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color={bodyColor} />
        </Capsule>
      </group>
      
      <group position={[0.7, 0.4, 0]}>
        <Capsule args={[0.2, 0.6, 16, 16]} position={[0, -0.4, 0]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color={bodyColor} />
        </Capsule>
      </group>

      {/* Legs */}
      <Capsule args={[0.25, 0.5, 16, 16]} position={[-0.35, -0.8, 0.2]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Capsule>
      <Capsule args={[0.25, 0.5, 16, 16]} position={[0.35, -0.8, 0.2]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Capsule>
    </group>
  );
};

const MascotScene = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#FF9800" />
      <Environment preset="sunset" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <CuteBear />
      </Float>

      <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#FF9800" />
    </>
  );
};

// --- Hooks ---
const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

// --- Components ---
const StatItem = ({ end, suffix, label }) => {
  const count = useCounter(end, 2500);
  return (
    <div className="stat-card glass-card">
      <h3>{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
};

const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };
  return (
    <div 
      ref={cardRef}
      className={`curriculum-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const FloatingEmojis = () => {
  const emojis = ['⭐', '🌈', '☁️', '🧸', '🎈', '✨', '🍼', '🎨'];
  const items = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5
  }));

  return (
    <div className="floating-icons-layer">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="float-icon"
          style={{ left: item.left, top: item.top }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// --- App ---
const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    // Fake progress
    const interval = setInterval(() => {
      setLoadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return p + 5;
      });
    }, 100);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleMouseMove = (e) => {
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
        cursorOutlineRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 100, opacity: 0, scale: 0.9, rotationX: 15 },
          { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
        );
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '80px', marginBottom: '20px' }}
        >
          🧸
        </motion.div>
        <h2 className="loading-logo">TRÍ TÂM</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${loadProgress}%` }}></div>
        </div>
      </div>
    );
  }

  const galleryImages = [
    "https://images.unsplash.com/photo-1543854589-9ebba41b02ea?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503676382389-0ea608b6b107?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603354350317-6f7ab20665be?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>
      <FloatingEmojis />

      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="nav-logo">
            <span style={{ fontSize: '36px' }}>✨</span> Trí Tâm
          </a>
          <ul className="nav-links">
            <li><a href="#home">Trang chủ</a></li>
            <li><a href="#curriculum">Chương trình</a></li>
            <li><a href="#about">Vì sao chọn</a></li>
            <li><a href="#gallery">Thư viện</a></li>
          </ul>
          <a href="#contact" className="btn-glow" style={{ padding: '10px 24px' }}>Đăng ký tham quan</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container" style={{ display: 'flex', position: 'relative', height: '100%' }}>
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="hero-title">Nuôi dưỡng tuổi thơ bằng yêu thương</h1>
            <p className="hero-slogan">Môi trường giáo dục hiện đại giúp trẻ phát triển toàn diện từ những năm đầu đời. Hành trang vững chắc cho tương lai của bé.</p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-glow">Đăng ký tham quan</a>
              <a href="#curriculum" className="btn-outline">Xem chương trình</a>
            </div>
          </motion.div>

          <div className="hero-3d-container">
            <div className="speech-bubble">👋 Xin chào bé yêu đến với Trí Tâm!</div>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <MascotScene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid gsap-reveal">
            <StatItem end={500} suffix="+" label="Học sinh" />
            <StatItem end={25} suffix="" label="Năm hoạt động" />
            <StatItem end={40} suffix="+" label="Giáo viên" />
            <StatItem end={98} suffix="%" label="Hài lòng" />
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="curriculum">
        <div className="container">
          <h2 className="section-title gsap-reveal">Chương Trình Học</h2>
          <p className="section-subtitle gsap-reveal">Phương pháp giáo dục tiên tiến, thiết kế riêng biệt phù hợp với từng giai đoạn phát triển của trẻ, tạo bước đệm hoàn hảo.</p>
          
          <div className="curriculum-grid gsap-reveal">
            <TiltCard className="glass-card">
              <div className="card-icon"><FaHeart /></div>
              <h3>Nhà trẻ</h3>
              <p>Phát triển thể chất, ngôn ngữ và cảm xúc thông qua các hoạt động vui chơi tương tác an toàn và ngập tràn tình yêu thương.</p>
            </TiltCard>
            <TiltCard className="glass-card">
              <div className="card-icon"><FaGraduationCap /></div>
              <h3>Mẫu giáo bé</h3>
              <p>Khám phá thế giới xung quanh, rèn luyện kỹ năng tự lập và khơi dậy tiềm năng sáng tạo bẩm sinh của từng bé.</p>
            </TiltCard>
            <TiltCard className="glass-card">
              <div className="card-icon"><FaGlobeAmericas /></div>
              <h3>Mẫu giáo lớn</h3>
              <p>Trang bị kiến thức tiền tiểu học, làm quen tiếng Anh quốc tế và hoàn thiện kỹ năng giao tiếp xã hội chuẩn bị vào lớp 1.</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features">
        <div className="container">
          <h2 className="section-title gsap-reveal">Vì Sao Chọn Trí Tâm?</h2>
          <p className="section-subtitle gsap-reveal">Môi trường giáo dục an toàn, hiện đại, mang đẳng cấp quốc tế ngay tại Việt Nam.</p>
          
          <div className="features-grid gsap-reveal">
            <TiltCard className="feature-item">
              <div className="feature-icon"><FaCamera /></div>
              <div className="feature-content">
                <h4>Camera Giám Sát 24/7</h4>
                <p>Hệ thống an ninh độ nét cao, ba mẹ an tâm theo dõi con mọi lúc mọi nơi.</p>
              </div>
            </TiltCard>
            <TiltCard className="feature-item">
              <div className="feature-icon"><FaHeart /></div>
              <div className="feature-content">
                <h4>Giáo Viên Tận Tâm</h4>
                <p>Đội ngũ giáo viên giàu kinh nghiệm, luôn yêu thương và kiên nhẫn với trẻ.</p>
              </div>
            </TiltCard>
            <TiltCard className="feature-item">
              <div className="feature-icon"><FaGlobeAmericas /></div>
              <div className="feature-content">
                <h4>Tiếng Anh Quốc Tế</h4>
                <p>Chương trình song ngữ bản xứ, giúp trẻ phản xạ tự nhiên từ nhỏ.</p>
              </div>
            </TiltCard>
            <TiltCard className="feature-item">
              <div className="feature-icon"><FaAppleAlt /></div>
              <div className="feature-content">
                <h4>Dinh Dưỡng Khoa Học</h4>
                <p>Thực đơn đa dạng, cân bằng, nguồn thực phẩm hữu cơ an toàn 100%.</p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery">
        <div className="container">
          <h2 className="section-title gsap-reveal">Khoảnh Khắc Đáng Yêu</h2>
          <p className="section-subtitle gsap-reveal">Nụ cười của bé là niềm hạnh phúc và thành công lớn nhất của chúng tôi.</p>
          
          <div className="masonry gsap-reveal">
            {galleryImages.map((src, index) => (
              <div key={index} className="gallery-item glass-card">
                <img src={src} alt="Gallery" loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-text">Vui chơi & Học tập</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title gsap-reveal">Phụ Huynh Nói Gì?</h2>
          
          <div className="testimonial-track gsap-reveal" style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="testimonial-card">
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"Bé nhà mình từ khi đi học ở Trí Tâm đã ngoan hơn, tự lập hơn rất nhiều. Cô giáo tận tình, cơ sở vật chất cực kỳ hiện đại, cao cấp!"</p>
              <div className="testimonial-author" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
                <div className="author-info">
                  <h5>Chị Mai Anh</h5>
                  <p>Mẹ bé Misa (Nhà trẻ)</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"Mình cực kỳ an tâm khi xem camera thấy con ăn ngủ ngoan. Chương trình tiếng Anh xuất sắc, phong cách học tập rất truyền cảm hứng."</p>
              <div className="testimonial-author" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
                <div className="author-info">
                  <h5>Anh Hoàng Tuấn</h5>
                  <p>Ba bé Ken (Mẫu giáo lớn)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="container gsap-reveal">
          <div className="cta-box">
            <h2>Bắt Đầu Hành Trình Cùng Bé Yêu!</h2>
            <p>Đăng ký tham quan miễn phí ngay hôm nay để nhận ưu đãi học phí cực khủng!</p>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#" className="btn-outline" style={{ background: 'white', color: '#FF5722', border: 'none' }}>Đăng ký trực tuyến</a>
              <h3 style={{ fontSize: '32px', textShadow: '0 0 20px white' }}>Hotline: 0123 456 789</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <a href="#" className="nav-logo">✨ Trí Tâm</a>
              <p>Trường mầm non tiên phong ứng dụng phương pháp giáo dục hiện đại, chuẩn quốc tế tại Việt Nam.</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <a href="#" className="social-icon"><FaFacebookF /></a>
                <a href="#" className="social-icon"><FaYoutube /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Liên Kết</h4>
              <ul style={{ listStyle: 'none' }}>
                <li><a href="#home">Trang chủ</a></li>
                <li><a href="#curriculum">Chương trình học</a></li>
                <li><a href="#about">Tuyển sinh</a></li>
                <li><a href="#contact">Liên hệ</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Thông Tin</h4>
              <ul style={{ listStyle: 'none' }}>
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#">Cơ sở vật chất</a></li>
                <li><a href="#">Thực đơn dinh dưỡng</a></li>
                <li><a href="#">Tin tức & Sự kiện</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Liên Hệ</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ color: 'var(--text-secondary)' }}>📍 123 Đường Tương Lai, TP.HCM</li>
                <li style={{ color: 'var(--text-secondary)' }}>📞 0123 456 789</li>
                <li style={{ color: 'var(--text-secondary)' }}>✉️ tuyensinh@tritam.edu.vn</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 Trí Tâm Kindergarten. Designed with 💖.
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
