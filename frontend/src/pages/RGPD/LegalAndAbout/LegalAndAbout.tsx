import About from '../About/About'
import ContactUs from '../ContactUs/ContactUs'
import LegalNotices from '../LegalNotices/LegalNotices'
import PrivacyPolicy from '../PrivacyPolicy/PrivacyPolicy'

function LegalAndAbout() {
    return (
        <div>
            <About />
            <LegalNotices />
            <PrivacyPolicy />
            <ContactUs />
        </div>
    )
}

export default LegalAndAbout