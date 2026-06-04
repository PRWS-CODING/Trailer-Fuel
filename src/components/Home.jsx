import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import "./Home.css";
import TrailerCards from "./TrailerCards";

function Home() {
  const [trailer, setTrailer] = useState("");
  const [hours, setHours] = useState("");
  const [fuel, setFuel] = useState("");
  const trailerInputRef = useRef(null);

  const handleEnter = async () => {
    if (!supabase) {
      alert(
        "Database connection is missing. Please check your .env configuration.",
      );
      return;
    }

    if (!trailer || !hours || !fuel) return alert("Please fill in all fields");

    const trailerNum = parseInt(trailer);
    const hoursNum = parseInt(hours);
    const fuelNum = parseFloat(fuel);

    if (isNaN(trailerNum) || isNaN(hoursNum) || isNaN(fuelNum))
      return alert("Please enter valid numbers");

    try {
      const { error } = await supabase.from("trailers").upsert(
        {
          trailer_number: trailerNum,
          hours: hoursNum,
          fuel: fuelNum,
          created_at: new Date().toISOString(),
        },
        { onConflict: "trailer_number" },
      );

      if (error) {
        console.error("Database Error:", error.message, error.details);
        alert(`Database Error: ${error.message}`);
        return;
      }
    } catch (err) {
      console.error("Network/Fetch Error:", err);
      alert(
        "Connection failed: Please check your internet or Supabase URL configuration.",
      );
      return;
    }

    // Clear fields after submission
    setTrailer("");
    setHours("");
    setFuel("");

    trailerInputRef.current?.focus();
  };

  return (
    <div>
      <div className="title">Trailer-fuel log</div>
      <div className="container">
        <div className="row">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Trailer Number"
            value={trailer}
            ref={trailerInputRef}
            onChange={(e) => setTrailer(e.target.value)}
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Hourmeter Reading"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Gallons"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
          />
        </div>
        <div className="enter">
          <button onClick={handleEnter}>Enter</button>
        </div>
      </div>
      <div className="trailer-title">Trailers:</div>
      <TrailerCards />
    </div>
  );
}

export default Home;
