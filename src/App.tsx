import React, { useContext } from 'react';
import { GlobalStateContext } from './context';
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import FreeComponent from "./FreeComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./Register";

function App() {
  const { state } = useContext(GlobalStateContext);

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <section id="navigation">
            <Link to="/">Home</Link>
            <Link to="/free">Free Component</Link>
            <Link to="/auth">Auth Component</Link>
            {!state.isLoggedIn ? (
              <Link to="/register">Register</Link>
            ) : ''}
          </section>
        </Col>
      </Row>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/free" element={<FreeComponent/>} />
        <Route path="/auth" element={<ProtectedRoutes/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Container>
  );
}

export default App;
