import {
  Header,
  Hero,
  Features,
  Stats,
  HowItWorks,
  Security,
  Download,
  Footer,
} from '../components/landing';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <Security />
        <Download />
      </main>
      <Footer />
    </div>
  );
}
