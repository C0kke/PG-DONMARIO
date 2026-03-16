import { motion } from 'framer-motion';
import Pannel from '../assets/MARANATHA_PANEL.png';
import WhatsappIcon from '../assets/whatsapp-icon.svg?react';
import EmailIcon from '../assets/email-icon.svg?react';
import LocationIcon from '../assets/location-icon.svg?react';
import './styles/Contacto.css';

export default function Contacto() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="contact-container container-max"
        >
            <div className="pannel-wrapper">
                <img src={Pannel} alt="Ferretería Maranatha Banner" className="pannel-image" />
            </div>

            <div className="contact-header">
                <h2>¿Necesitas contactarnos?</h2>
                <p>Estamos disponibles para resolver tus dudas y cotizaciones</p>
            </div>

            <div className="contact-grid">
                <a 
                    href="https://wa.me/56958985683?text=Hola%20Maranatha,%20quisiera%20consultar%20por..." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-card whatsapp-card"
                >
                    <img src={WhatsappIcon} alt="WhatsApp" className="contact-svg-icon" />
                    <h3>Hablemos por WhatsApp</h3>
                    <p>Respuesta rápida para cotizaciones</p>
                    <span className="action-text">Enviar Mensaje &rarr;</span>
                </a>

                <a 
                    href="mailto:ventas@maranatha.cl" 
                    className="contact-card email-card"
                >
                    <img src={EmailIcon} alt="Email" className="contact-svg-icon" />
                    <h3>Correo Electrónico</h3>
                    <p>Para solicitudes formales y empresas</p>
                    <span className="action-text">ventas@maranatha.cl</span>
                </a>

                <div className="contact-card location-card">
                    <img src={LocationIcon} alt="Ubicación" className="contact-svg-icon" />
                    <h3>Visítanos</h3>
                    <p>Coquimbo</p>
                    <div className="schedule-box">
                        <span className="schedule-title">Horario de Atención:</span>
                        <span>Lunes a Viernes: 08:30 - 18:00</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
