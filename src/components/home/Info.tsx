// Info section - basic information about the developer
import { Section } from "../ui/Section";

export function Info() {
  return (
    <Section id="info" className="info-section">
      <div className="info-content">
        <div className="info-columns">
          <p className="info-paragraph-intro">
            Tring to express my understanding of the world through my works — I
            create artworks and digital experiences that feel clear,
            intentional, and alive.
          </p>
          <p className="info-paragraph">
            I care about clean code, performance, and the small details that
            make an interface effortless to use.
            <br />
            My creative practice spans logo & font design, GFX & illustration,
            and music composition <br />
            <i>DnB / Progressive House / Artcore</i>
            <br /> I'm drawn to creation, and I bring that visual sensibility
            into every system I design and ship.
          </p>
        </div>
      </div>
    </Section>
  );
}
