'use client'

import React from 'react'
import Link from 'next/link'
import './footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Link href="/" className="logo-text">
                Spiderum's Logo
              </Link>
            </div>
            <div className="footer-links">
              <Link href="/contact">Liên Hệ</Link>
              <Link href="/terms">Điều kiện sử dụng</Link>
              <Link href="/download">Tải app Spiderum</Link>
            </div>
            <div className="app-badges">
              <div className="app-badge">App Store</div>
              <div className="app-badge">Google Play</div>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Thông tin công ty</h3>
            <div className="company-info">
              <p>Công ty Cổ Phần Felizz</p>
              <p>Trực thuộc Spiderum Vietnam JSC</p>
              <p>Chịu trách nhiệm nội dung: Trần Việt Anh</p>
              <p>Giấy phép MXH số 341/GP-TTTT do Bộ TTTT cấp ngày 27/06/2016</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Liên hệ hợp tác</h3>
            <div className="contact-info">
              <p>Email: <a href="mailto:contact@spiderum.com">contact@spiderum.com</a></p>
              <p>Điện thoại: <a href="tel:+84978944558">(+84) 978 944 558</a></p>
              <div className="address">
                <p>Tầng 11, tòa nhà HL Tower, lô A2B, phố Duy Tân, phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© Copyright 2017 - 2023</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 