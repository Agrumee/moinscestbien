import About from '../About/About'
import ContactUs from '../ContactUs/ContactUs'
import LegalNotices from '../LegalNotices/LegalNotices'
import PrivacyPolicy from '../PrivacyPolicy/PrivacyPolicy'
import "./LegalAndAbout.scss"

function LegalAndAbout() {
    return (
        <div className='p-legal-and-about'>
            <About />
            <LegalNotices />
            <PrivacyPolicy />
            <ContactUs />
        </div>
    )
}

export default LegalAndAbout