import {Nav, Navbar,  Image} from "react-bootstrap"



const TopBanner = () => {

    return (
        <>
            <Navbar expand="lg" style={{backgroundColor: "#213448"}}>
                <Navbar.Brand href="/"><Image src="../../resources/images/tonalya_logo.png" rounded/></Navbar.Brand>
            </Navbar>
            <Nav></Nav>
        </>
    );
}

export default TopBanner;