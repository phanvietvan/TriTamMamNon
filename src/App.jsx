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

// --- 3D MASCOT: Cute Pixar-Style Panda ---
const CutePanda = () => {
  const group = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const head = useRef();
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth floating
    group.current.position.y = Math.sin(t * 2.5) * 0.08 - 0.2;
    
    // Head looking at mouse with smooth easing
    const targetX = pointer.x * 0.8;
    const targetY = pointer.y * 0.8;
    head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, targetX, 0.08);
    head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -targetY, 0.08);
    
    // Cute arm waving
    leftArm.current.rotation.z = Math.sin(t * 6) * 0.4 - 0.4;
    rightArm.current.rotation.z = Math.sin(t * 4) * 0.1 + 0.4;
  });

  const furWhite = "#FAFAFA";
  const furBlack = "#2C3E50";
  const blushColor = "#FF8A80";

  return (
    <group ref={group} scale={0.8}>
      {/* Body */}
      <Sphere args={[0.7, 64, 64]} position={[0, -0.2, 0]} scale={[1, 0.9, 1]}>
        <meshStandardMaterial color={furWhite} roughness={0.8} />
      </Sphere>

      {/* Head Group */}
      <group ref={head} position={[0, 0.8, 0]}>
        {/* Main Head */}
        <Sphere args={[0.85, 64, 64]} scale={[1, 0.9, 1]}>
          <meshStandardMaterial color={furWhite} roughness={0.8} />
        </Sphere>

        {/* Ears */}
        <Sphere args={[0.25, 32, 32]} position={[-0.6, 0.6, -0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Sphere>
        <Sphere args={[0.25, 32, 32]} position={[0.6, 0.6, -0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Sphere>

        {/* Eye Patches (Black) */}
        <Sphere args={[0.25, 32, 32]} position={[-0.35, 0.1, 0.65]} scale={[1.2, 1, 0.4]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Sphere>
        <Sphere args={[0.25, 32, 32]} position={[0.35, 0.1, 0.65]} scale={[1.2, 1, 0.4]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Sphere>

        {/* Eyeballs (White) */}
        <Sphere args={[0.08, 16, 16]} position={[-0.3, 0.15, 0.76]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.08, 16, 16]} position={[0.3, 0.15, 0.76]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Sphere>

        {/* Pupils (Black) */}
        <Sphere args={[0.04, 16, 16]} position={[-0.28, 0.16, 0.82]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.04, 16, 16]} position={[0.28, 0.16, 0.82]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* Eye highlights (Tiny white dots) */}
        <Sphere args={[0.015, 8, 8]} position={[-0.26, 0.18, 0.85]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.015, 8, 8]} position={[0.26, 0.18, 0.85]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>

        {/* Muzzle */}
        <Sphere args={[0.35, 32, 32]} position={[0, -0.2, 0.75]} scale={[1.3, 0.8, 0.8]}>
          <meshStandardMaterial color={furWhite} roughness={0.8} />
        </Sphere>

        {/* Nose */}
        <Sphere args={[0.1, 16, 16]} position={[0, -0.1, 1.05]} scale={[1.2, 0.8, 0.8]}>
          <meshStandardMaterial color="#111" />
        </Sphere>

        {/* Blush */}
        <Sphere args={[0.15, 16, 16]} position={[-0.6, -0.1, 0.6]} scale={[1, 0.5, 0.2]}>
          <meshStandardMaterial color={blushColor} opacity={0.6} transparent />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[0.6, -0.1, 0.6]} scale={[1, 0.5, 0.2]}>
          <meshStandardMaterial color={blushColor} opacity={0.6} transparent />
        </Sphere>
      </group>

      {/* Arms */}
      <group position={[-0.65, 0.1, 0]} ref={leftArm}>
        <Capsule args={[0.18, 0.5, 16, 16]} position={[0, -0.3, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Capsule>
      </group>
      
      <group position={[0.65, 0.1, 0]} ref={rightArm}>
        <Capsule args={[0.18, 0.5, 16, 16]} position={[0, -0.3, 0]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color={furBlack} roughness={0.9} />
        </Capsule>
      </group>

      {/* Legs */}
      <Capsule args={[0.2, 0.4, 16, 16]} position={[-0.35, -0.8, 0.2]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color={furBlack} roughness={0.9} />
      </Capsule>
      <Capsule args={[0.2, 0.4, 16, 16]} position={[0.35, -0.8, 0.2]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color={furBlack} roughness={0.9} />
      </Capsule>

      {/* Cute little tail */}
      <Sphere args={[0.2, 16, 16]} position={[0, -0.5, -0.6]}>
        <meshStandardMaterial color={furBlack} />
      </Sphere>
    </group>
  );
};

const MascotScene = () => {
  return (
    <>
      <ambientLight intensity={1.2} />
      {/* Key Light */}
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2.5} color="#ffffff" castShadow />
      {/* Fill Light */}
      <pointLight position={[-10, 5, 10]} intensity={1.5} color="#4FC3F7" />
      {/* Rim Light for cinematic look */}
      <pointLight position={[0, 5, -10]} intensity={3} color="#80D8FF" />
      <Environment preset="city" />
      
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <CutePanda />
      </Float>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={3} far={4} color="#000000" />
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

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ parentName: '', phone: '', childAge: '', note: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setFormData({ parentName: '', phone: '', childAge: '', note: '' });
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Không thể kết nối đến server.');
    }
  };

  return (
    <form className="registration-form glass-card" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 20 }}>
      <input type="text" placeholder="Tên Phụ Huynh *" required value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
      <input type="tel" placeholder="Số điện thoại *" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      <input type="text" placeholder="Độ tuổi của bé" value={formData.childAge} onChange={e => setFormData({...formData, childAge: e.target.value})} />
      <textarea placeholder="Ghi chú thêm" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows="3"></textarea>
      
      {message && <div className={`form-msg ${status}`}>{message}</div>}
      
      <button type="submit" className="btn-glow" disabled={status === 'loading'} style={{ width: '100%', marginTop: '10px', cursor: 'none' }}>
        {status === 'loading' ? 'Đang gửi...' : 'Đăng ký ngay'}
      </button>
    </form>
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
          <a href="#contact" className="btn-glow" style={{ padding: '10px 24px' }}>Đăng ký cho bé ngay</a>
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
              <a href="#contact" className="btn-glow">Đăng ký cho bé ngay</a>
              <a href="#curriculum" className="btn-outline">Xem chương trình</a>
            </div>
          </motion.div>

          <div className="hero-3d-container">
            <div className="speech-bubble">👋 Xin chào bé yêu đến với Nhóm Trẻ Trí Tâm!</div>
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
            <RegistrationForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <a href="#" className="nav-logo">✨ Trí Tâm</a>
              <p>Nhóm trẻ tiên phong ứng dụng phương pháp giáo dục hiện đại, chuẩn quốc tế tại Việt Nam.</p>
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
            &copy; 2026 Nhóm Trẻ Trí Tâm. Designed with 💖.
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
