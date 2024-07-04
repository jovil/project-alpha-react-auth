import { useContext } from "react";
import { GlobalStateContext } from "./context";
import { Container, Col, Row, Button, Stack } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import FreeComponent from "./FreeComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./Register";
import Login from "./Login";

function App() {
  const { state } = useContext(GlobalStateContext);

  return (
    <Container>
      <header>
        <Row className="my-10">
          <Col></Col>
          <Col className="flex justify-center" xs={6}>
            <Stack className="gap-x-8" direction="horizontal">
              <Link to="/">Home</Link>
              <Link to="/free">Free Component</Link>
              <Link to="/auth">Auth Component</Link>
            </Stack>
          </Col>
          <Col>
            <Stack className="flex justify-end" direction="horizontal" gap={3}>
              {!state.isLoggedIn ? (
                <>
                  <Link to="/login">
                    <Button variant="primary">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline-dark">Register</Button>
                  </Link>
                </>
              ) : (
                ""
              )}
            </Stack>
          </Col>
        </Row>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/free" element={<FreeComponent />} />
          <Route path="/auth" element={<ProtectedRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Container>
  );
}

export default App;
