import { useState, useEffect } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showNgoDetails, setShowNgoDetails] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("hopeconnect_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [donationData, setDonationData] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });

  const [volunteerData, setVolunteerData] = useState({
    name: "",
    email: "",
    city: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [donationMessage, setDonationMessage] = useState("");
  const [volunteerMessage, setVolunteerMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  // Sync user info when logged in
  useEffect(() => {
    if (currentUser) {
      setDonationData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
      }));
      setVolunteerData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("hopeconnect_user");
    setCurrentUser(null);
  };

  const openDonationModal = (customMessage = "") => {
    setDonationData((prev) => ({
      ...prev,
      name: prev.name || (currentUser ? currentUser.name : ""),
      email: prev.email || (currentUser ? currentUser.email : ""),
      message: customMessage !== "" ? customMessage : prev.message,
    }));
    setDonationMessage("");
    setShowDonationForm(true);
  };

  const openVolunteerModal = () => {
    setVolunteerData((prev) => ({
      ...prev,
      name: prev.name || (currentUser ? currentUser.name : ""),
      email: prev.email || (currentUser ? currentUser.email : ""),
    }));
    setVolunteerMessage("");
    setShowVolunteerForm(true);
  };

  // ---------------- DONATION ----------------

  const handleDonationChange = (e) => {
    setDonationData({
      ...donationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    setDonationMessage("Saving donation...");

    try {
      const response = await fetch(`${API}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: donationData.name.trim(),
          email: donationData.email.trim(),
          amount: Number(donationData.amount),
          message: donationData.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDonationMessage(
          "❤️ Donation successful! Thank you for supporting HopeConnect."
        );

        setDonationData({
          name: currentUser ? currentUser.name : "",
          email: currentUser ? currentUser.email : "",
          amount: "",
          message: "",
        });
      } else {
        setDonationMessage(
          data.message || "❌ Donation failed."
        );
      }
    } catch (error) {
      console.error("Donation Error:", error);
      setDonationMessage(
        "❌ Cannot connect to backend. Make sure backend is running."
      );
    }
  };

  // ---------------- VOLUNTEER ----------------

  const handleVolunteerChange = (e) => {
    setVolunteerData({
      ...volunteerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVolunteer = async (e) => {
    e.preventDefault();
    setVolunteerMessage("Registering...");

    try {
      const response = await fetch(`${API}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: volunteerData.name.trim(),
          email: volunteerData.email.trim(),
          city: volunteerData.city.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVolunteerMessage(
          "🎉 Volunteer registration successful! Welcome to HopeConnect."
        );

        setVolunteerData({
          name: currentUser ? currentUser.name : "",
          email: currentUser ? currentUser.email : "",
          city: "",
        });
      } else {
        setVolunteerMessage(
          data.message || "❌ Registration failed."
        );
      }
    } catch (error) {
      console.error("Volunteer Error:", error);
      setVolunteerMessage(
        "❌ Cannot connect to backend. Make sure backend is running."
      );
    }
  };

  // ---------------- LOGIN ----------------

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("Logging in...");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim().toLowerCase(),
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMessage(
          `❤️ ${data.message}`
        );

        if (data.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem("hopeconnect_user", JSON.stringify(data.user));
          } catch (e) {
            console.warn("Could not save to localStorage:", e);
          }
        }

        setLoginData({
          email: "",
          password: "",
        });

        setTimeout(() => {
          setShowLoginForm(false);
          setLoginMessage("");
        }, 1200);
      } else {
        setLoginMessage(
          data.message || "❌ Invalid email or password."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginMessage(
        "❌ Cannot connect to backend. Make sure backend is running."
      );
    }
  };

  // ---------------- SIGNUP ----------------

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage("Creating account...");

    try {
      const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name.trim(),
          email: signupData.email.trim().toLowerCase(),
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupMessage(
          "🎉 Account created successfully! You can now login."
        );

        setSignupData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          setShowSignupForm(false);
          setShowLoginForm(true);
          setSignupMessage("");
          setLoginMessage("Account created! Please log in.");
        }, 1200);
      } else {
        setSignupMessage(
          data.message || "❌ Account creation failed."
        );
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setSignupMessage(
        "❌ Cannot connect to backend. Make sure backend is running."
      );
    }
  };

  return (
    <div>

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>HopeConnect</h2>

        <ul>
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </li>
          <li onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
            About
          </li>
          <li onClick={() => document.getElementById("ngos")?.scrollIntoView({ behavior: "smooth" })}>
            NGOs
          </li>

          <li onClick={() => openDonationModal()}>
            Donate
          </li>

          <li onClick={() => openVolunteerModal()}>
            Volunteer
          </li>

          <li onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Contact
          </li>
        </ul>

        {currentUser ? (
          <button
            className="login"
            onClick={handleLogout}
            title="Click to Logout"
          >
            Logout ({currentUser.name})
          </button>
        ) : (
          <button
            className="login"
            onClick={() => {
              setShowLoginForm(true);
              setLoginMessage("");
            }}
          >
            Login
          </button>
        )}
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <h1>Helping Every Child Smile ❤️</h1>

        <p>
          Donate Food, Clothes, Money, Books, Toys,
          Education and Health Support.
        </p>

        <button onClick={() => openDonationModal()}>
          Donate Now
        </button>

        <button onClick={() => openVolunteerModal()}>
          Become Volunteer
        </button>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <h2>About HopeConnect</h2>

        <p>
          HopeConnect connects NGOs, orphanages and
          people who want to help children.
        </p>
      </section>

      {/* DONATION CATEGORIES */}
      <section className="donation" id="donation">
        <h2>Donation Categories</h2>

        <div className="cards">
          <div className="card" onClick={() => openDonationModal("Donation Category: Money")}>💰 Money</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Clothes")}>👕 Clothes</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Food")}>🍚 Food</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Books")}>📚 Books</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Toys")}>🧸 Toys</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Medicines")}>💊 Medicines</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: School Bags")}>🎒 School Bags</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Shoes")}>👟 Shoes</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Hygiene Kits")}>🧼 Hygiene Kits</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Health")}>🏥 Health</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Education")}>🎓 Education</div>
          <div className="card" onClick={() => openDonationModal("Donation Category: Sponsor Child")}>❤️ Sponsor Child</div>
        </div>
      </section>

      {/* NGO */}
      <section className="ngo" id="ngos">
        <h2>Featured NGO</h2>

        <div className="card">
          <h3>Sunshine Orphanage</h3>

          <p>Pune, Maharashtra</p>

          <button onClick={() => setShowNgoDetails(true)}>
            View Details
          </button>
        </div>
      </section>

      {/* VOLUNTEER */}
      <section className="volunteer" id="volunteer">
        <h2>Become a Volunteer</h2>

        <form onSubmit={handleVolunteer}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={volunteerData.name}
            onChange={handleVolunteerChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={volunteerData.email}
            onChange={handleVolunteerChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={volunteerData.city}
            onChange={handleVolunteerChange}
            required
          />

          <button type="submit">
            Register
          </button>
        </form>

        {volunteerMessage && (
          <p style={{ marginTop: "15px", fontWeight: "bold" }}>
            {volunteerMessage}
          </p>
        )}
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <h2>Contact Us</h2>

        <p>📍 Pune</p>
        <p>📧 hopeconnect@gmail.com</p>
        <p>📞 9876543210</p>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 HopeConnect</p>
      </footer>

      {/* FEATURED NGO DETAILS POPUP */}
      {showNgoDetails && (
        <div className="donation-overlay">
          <div className="donation-form">
            <button
              className="close-button"
              onClick={() => setShowNgoDetails(false)}
            >
              ✖
            </button>

            <h2>🏢 Sunshine Orphanage</h2>

            <div style={{ textAlign: "left", fontSize: "14px", lineHeight: "1.7", color: "#333", margin: "15px 0" }}>
              <p>📍 <strong>Location:</strong> Pune, Maharashtra</p>
              <p>🗓️ <strong>Established:</strong> 2015</p>
              <p>👶 <strong>Children Supported:</strong> 120+ Orphaned & Underprivileged Children</p>
              <p>🎯 <strong>Mission:</strong> Dedicated to providing safe shelter, balanced nutrition, quality education, healthcare, and guidance to give every child a brighter future.</p>
              <p>📦 <strong>Urgent Needs:</strong> Books, clothes, dry rations, school bags, and hygiene kits.</p>
              <p>📞 <strong>Contact:</strong> sunshine.orphanage@gmail.com | 9876543210</p>
            </div>

            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={() => {
                setShowNgoDetails(false);
                openDonationModal("Donation for Sunshine Orphanage");
              }}
            >
              Donate to Sunshine Orphanage ❤️
            </button>
          </div>
        </div>
      )}

      {/* DONATION POPUP */}
      {showDonationForm && (
        <div className="donation-overlay">

          <div className="donation-form">

            <button
              className="close-button"
              onClick={() => {
                setShowDonationForm(false);
                setDonationMessage("");
              }}
            >
              ✖
            </button>

            <h2>❤️ Make a Donation</h2>

            <form onSubmit={handleDonation}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={donationData.name}
                onChange={handleDonationChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={donationData.email}
                onChange={handleDonationChange}
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Donation Amount"
                value={donationData.amount}
                onChange={handleDonationChange}
                min="1"
                required
              />

              <textarea
                name="message"
                placeholder="Message (Optional)"
                value={donationData.message}
                onChange={handleDonationChange}
              ></textarea>

              <button type="submit">
                Donate ❤️
              </button>

            </form>

            {donationMessage && (
              <p>{donationMessage}</p>
            )}

          </div>
        </div>
      )}

      {/* VOLUNTEER POPUP */}
      {showVolunteerForm && (
        <div className="donation-overlay">

          <div className="donation-form">

            <button
              className="close-button"
              onClick={() => {
                setShowVolunteerForm(false);
                setVolunteerMessage("");
              }}
            >
              ✖
            </button>

            <h2>🤝 Become a Volunteer</h2>

            <form onSubmit={handleVolunteer}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={volunteerData.name}
                onChange={handleVolunteerChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={volunteerData.email}
                onChange={handleVolunteerChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="Your City"
                value={volunteerData.city}
                onChange={handleVolunteerChange}
                required
              />

              <button type="submit">
                Register 🤝
              </button>

            </form>

            {volunteerMessage && (
              <p>{volunteerMessage}</p>
            )}

          </div>
        </div>
      )}

      {/* LOGIN POPUP */}
      {showLoginForm && (
        <div className="donation-overlay">

          <div className="donation-form">

            <button
              className="close-button"
              onClick={() => {
                setShowLoginForm(false);
                setLoginMessage("");
              }}
            >
              ✖
            </button>

            <h2>🔐 Login to HopeConnect</h2>

            <form onSubmit={handleLogin}>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />

              <button type="submit">
                Login 🔐
              </button>

            </form>

            {loginMessage && (
              <p>{loginMessage}</p>
            )}

            <button
              onClick={() => {
                setShowLoginForm(false);
                setShowSignupForm(true);
                setLoginMessage("");
              }}
            >
              Create New Account
            </button>

          </div>
        </div>
      )}

      {/* SIGNUP POPUP */}
      {showSignupForm && (
        <div className="donation-overlay">

          <div className="donation-form">

            <button
              className="close-button"
              onClick={() => {
                setShowSignupForm(false);
                setSignupMessage("");
              }}
            >
              ✖
            </button>

            <h2>📝 Create Account</h2>

            <form onSubmit={handleSignup}>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                minLength="6"
                required
              />

              <button type="submit">
                Create Account 📝
              </button>

            </form>

            {signupMessage && (
              <p>{signupMessage}</p>
            )}

            <button
              onClick={() => {
                setShowSignupForm(false);
                setShowLoginForm(true);
                setSignupMessage("");
              }}
            >
              Back to Login
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;