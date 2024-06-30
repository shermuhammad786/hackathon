import React from "react";

export default function location() {
  const findloca = () => {
    console.log("this is working...");
  };
  return (
    <div>
      <h1>Find Location</h1>
      <button onClick={findloca}>Start Quiz</button>
    </div>
  );
}
