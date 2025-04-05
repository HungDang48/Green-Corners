import React from 'react';
import Image from 'next/image';
import './banner.css';

const Banner: React.FC = () => {
  return (
    <div className="banner-container">
      <div className="banner-image">
        <Image
          src="https://images.spiderum.com/sp-images/da501690101911eabf79ff23ff2ce186.png"
          alt="Spiderum Banner"
          width={1200}
          height={400}
          priority
        />
        <div className="banner-overlay">
          <h1 className="banner-title">Góc nhìn đa chiều của thế hệ trẻ Việt Nam</h1>
          <p className="banner-subtitle">Viết - Chia sẻ - Kết nối - Chiêm nghiệm</p>
          <p className="banner-tagline">Tất cả tại Spiderum</p>
        </div>
      </div>
    </div>
  );
};

export default Banner; 