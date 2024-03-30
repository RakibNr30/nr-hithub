import "../static/css/style.css"
import {Link} from "react-router-dom";

const AppLayout = ({children}) => {

    return (
        <>
            <section className="topbar">
                <div className="container container-2">
                    <div className="row align-items-center">
                        <Link to="/" className="logo-section">
                            <img src="/images/logo2.png" className="logo" alt="logo"/>
                            <span className="logo-text">HitHub</span>
                        </Link>
                    </div>
                </div>
            </section>

            {children}
        </>
    )
}

export default AppLayout;