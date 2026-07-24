import "./App.css";

function App() {
  return (
    <div>

      <nav className="navbar">
        <h2>HopeConnect</h2>

        <ul>
          <li>Home</li>
          <li>About</li>
          <li>NGOs</li>
          <li>Donate</li>
          <li>Volunteer</li>
          <li>Contact</li>
        </ul>

        <button className="login">Login</button>
      </nav>

      <section className="hero">
        <h1>Helping Every Child Smile ❤️</h1>

        <p>
          Donate Food, Clothes, Money, Books, Toys,
          Education and Health Support.
        </p>

        <button>Donate Now</button>
        <button>Become Volunteer</button>
      </section>

      <section className="about">
        <h2>About HopeConnect</h2>

        <p>
          HopeConnect connects NGOs, orphanages and
          people who want to help children.
        </p>
      </section>

      <section className="donation">
        <h2>Donation Categories</h2>

        <div className="cards">

          <div className="card">💰 Money</div>
          <div className="card">👕 Clothes</div>
          <div className="card">🍚 Food</div>
          <div className="card">📚 Books</div>
          <div className="card">🧸 Toys</div>
          <div className="card">💊 Medicines</div>
          <div className="card">🎒 School Bags</div>
          <div className="card">👟 Shoes</div>
          <div className="card">🧼 Hygiene Kits</div>
          <div className="card">🏥 Health</div>
          <div className="card">🎓 Education</div>
          <div className="card">❤️ Sponsor Child</div>

        </div>
      </section>

      <section className="ngo">
        <h2>Featured NGO</h2>

        <div className="card">
          <h3>Sunshine Orphanage</h3>
          <p>Pune, Maharashtra</p>
          <button>View Details</button>
        </div>
      </section>

      <section className="volunteer">
        <h2>Become a Volunteer</h2>

        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="City" />

        <button>Register</button>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>

        <p>📍 Pune</p>
        <p>📧 hopeconnect@gmail.com</p>
        <p>📞 9876543210</p>
      </section>

      <footer>
        <p>© 2026 HopeConnect</p>
      </footer>

    </div>
  );
}

export default App;