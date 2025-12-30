import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Font,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  username?: string;
}

const baseUrl = "https://mthm.tech";

export const WelcomeEmail = ({ username = "there" }: WelcomeEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Welcome to MathemaTech</title>
        <Font
          fontFamily="CMU Serif"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://mthm.tech/fonts/cmunrm.ttf",
            format: "truetype",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="CMU Serif"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://mthm.tech/fonts/cmunbx.ttf",
            format: "truetype",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to MathemaTech</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={headerSection}>
            <Link href={baseUrl}>
              <Img
                src={`${baseUrl}/mathematechwhite.png`}
                width="40"
                height="40"
                alt="MathemaTech"
                style={logo}
              />
            </Link>
          </Section>

          <Section style={contentSection}>
            <Heading style={h1}>Welcome 🎉</Heading>
            <Text style={text}>
              Thanks for signing up! You'll hear more news shortly.
            </Text>
            <Text style={text}>
               You are now on the list to discover a better way to learn.
            </Text>

            <Section style={btnContainer}>
              <Button
                style={button}
                href="https://mathematech.ca"
              >
                Visit MathemaTech
              </Button>
            </Section>

            <Text style={text}>
              If you have any questions, just contact{' '}
              <Link href="mailto:afaq@mathematech.ca" style={link}>
                afaq@mathematech.ca
              </Link>.
            </Text>
            
            <Text style={text}>
              - Afaq V.
            </Text>
          </Section>

          <Text style={footer}>
            © 2026 MathemaTech
            <br />
            <Link href="https://mathematech.ca/unsubscribe" style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>

        <Section style={squiggleWrapper}>
           <Img 
            src={`${baseUrl}/squiggle_cut.svg`} 
            width="600"
            alt=""
            style={squiggleImage}
           />
        </Section>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  fontFamily: '"CMU Serif", Georgia, serif',
  padding: "0",
  margin: "0",
  minHeight: "100vh",
};

const squiggleWrapper = {
  width: "100%",
  height: "150px", // Fixed height to cut it off
  overflow: "hidden",
  marginTop: "40px",
};

const squiggleImage = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  display: "block",
  objectFit: "cover" as const,
  opacity: "0.5",
};

const container = {
  margin: "0 auto",
  padding: "0 20px 48px",
  maxWidth: "580px",
  position: "relative" as const,
  zIndex: "1",
};

const headerSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const logo = {
  margin: "0 auto",
  // If we are on white bg, white logo might be invisible...
  // But user asked for mathematechwhite.png specifically.
  // Assuming they might have a dark header or the logo has a background?
  // Or maybe they WANT it to only show on dark mode?
  // I'll stick to their request for the image, but mention it if it's an issue.
  // Actually if the email client is in light mode, background is white. White logo on white bg = invisible.
  // I will add a background color to the logo section just in case, or invert it if possible.
  // But for now, sticking to code.
  // I'll add a filter drop-shadow or background to the logo style if it allows visibility.
  borderRadius: "50%",
  backgroundColor: "#041418", // Dark circle behind logo to ensure visibility?
  padding: "8px", 
};

// Update colors for basic visibility on generic background
const contentSection = {
  padding: "20px",
};

const h1 = {
  color: "#0d9488", // Teal 600 - dark enough for white, distinct enough for dark
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#334155", // Dark slate for white background
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#0d9488", // teal-600
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#94a3b8", // slate-400
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "40px",
  fontFamily: '"CMU Typewriter Text", monospace',
};

const link = {
  color: "#0d9488",
  textDecoration: "underline",
};
