import {Nav, Navbar,  Image} from "react-bootstrap"



const TopBanner = () => {

    return (
        <div style={{  marginBottom: "50px"}}>
            <Navbar  expand="lg" style={{backgroundColor: "#213448", position: "fixed", width: "100%", height: "50px", zIndex: 1 }}>
                <Navbar.Brand href="/"><Image src="../../resources/images/tonalya_logo.png" rounded/></Navbar.Brand>
            </Navbar>
            <Nav></Nav>
        </div>
    );
}

export default TopBanner;