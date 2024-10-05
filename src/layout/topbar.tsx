import {Button, Navbar} from "flowbite-react";
import {Link} from "react-router-dom";

export default function TopBar() {
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="https://flowbite-react.com">
                <img src="/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
            </Navbar.Brand>
            <div className="flex md:order-2 gap-2">
                <Button color="light">Login</Button>
                <Link to="/login"><Button>Logout</Button></Link>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="#" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="/">Form1</Navbar.Link>
                <Navbar.Link href="/form2">Form2</Navbar.Link>
                <Navbar.Link href="/form3">Form3</Navbar.Link>
                <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>

    )
}