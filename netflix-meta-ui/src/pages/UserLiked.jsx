import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import styled from "styled-components";
import Navbar from "../components/Navbar";

export default function UserLiked() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);

  // navigate("/login");

  return (
    <Container>
      <Navbar />
      <div className="content flex column">
        <h1>My List</h1>
        <div className="grid flex">
          {/* {movies.map((movie, index) => {
            return (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            );
          })} */}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: .5rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 2rem;
    }
  }
`;
