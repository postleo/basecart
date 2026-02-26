import Layout from '../components/Layout';
import Logo from '../components/Logo';

export default function About() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'var(--primary)',
          marginBottom: 20,
          textShadow: '2px 2px 0 var(--secondary)',
        }}>
          OUR STORY
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 40,
        alignItems: 'center',
      }}>
        <div>
          <Logo size="large" />
        </div>
        
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 30,
          padding: 40,
        }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: 28,
            color: 'var(--secondary)',
            marginBottom: 20,
          }}>
            <i className="fas fa-sun" style={{ color: 'var(--primary)', marginRight: 12 }}></i>
            The Golden Hour
          </h2>
          <p style={{
            fontSize: 18,
            lineHeight: 1.8,
            color: 'var(--text)',
            marginBottom: 20,
          }}>
            Founded in 2018, Golden Hour Coffee Co. was born from a simple idea: 
            the best moments in life happen during the golden hours—those magical 
            times when the light is just right, and everything feels possible.
          </p>
          <p style={{
            fontSize: 18,
            lineHeight: 1.8,
            color: 'var(--text)',
          }}>
            We source our beans from sustainable farms around the world, roast them 
            in small batches, and serve them with care. Every cup is crafted to capture 
            that golden moment.
          </p>
        </div>
      </div>

      {/* Values */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: 32,
          textAlign: 'center',
          color: 'var(--text)',
          marginBottom: 40,
        }}>
          Our Values
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 30,
        }}>
          {[
            { icon: 'fa-leaf', title: 'Sustainability', desc: 'We partner with eco-conscious farms and use compostable materials.' },
            { icon: 'fa-users', title: 'Community', desc: 'We create spaces where neighbors become friends over great coffee.' },
            { icon: 'fa-medal', title: 'Quality', desc: 'Every bean is carefully selected and roasted to perfection.' },
            { icon: 'fa-heart', title: 'Passion', desc: 'We love what we do, and it shows in every cup we serve.' },
          ].map((value, index) => (
            <div key={index} style={{
              background: 'var(--card-bg)',
              borderRadius: 30,
              padding: 30,
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                width: 70,
                height: 70,
                margin: '0 auto 20px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className={`fas ${value.icon}`} style={{ fontSize: 28, color: 'white' }}></i>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 10 }}>
                {value.title}
              </h3>
              <p style={{ fontSize: 16, color: 'var(--text)', opacity: 0.8 }}>
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{
        marginTop: 60,
        background: 'var(--secondary)',
        borderRadius: 30,
        padding: 50,
        textAlign: 'center',
        color: 'white',
      }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 20 }}>
          Meet Our Team
        </h2>
        <p style={{ fontSize: 18, maxWidth: 600, margin: '0 auto', opacity: 0.9 }}>
          Our skilled baristas bring years of experience and a genuine passion for 
          coffee. Visit us and let them craft your perfect cup.
        </p>
      </div>
    </Layout>
  );
}
