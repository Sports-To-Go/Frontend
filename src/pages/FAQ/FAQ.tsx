import { FC, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import './FAQ.scss';

const faqList = [
  {
    question: 'Cum pot să îmi schimb parola?',
    answer: 'Accesează profilul tău și mergi la setări pentru a schimba parola.',
  },
  {
    question: 'Pot să editez o recenzie după ce am trimis-o?',
    answer: 'Momentan, recenziile nu pot fi editate. Poți trimite o nouă recenzie dacă este necesar.',
  },
  {
    question: 'Cum pot șterge contul meu?',
    answer: 'Trimite o solicitare prin formularul de contact de mai jos și te vom ajuta.',
  },
  {
    question: 'Cum funcționează rezervările?',
    answer: 'Poți face rezervări direct din pagina locației dorite selectând data și intervalul orar.',
  },
  {
    question: 'Care sunt metodele de plată acceptate?',
    answer: 'Acceptăm carduri de credit/debit și plata la fața locului pentru anumite servicii.',
  },
  {
    question: 'Cum pot contacta suportul?',
    answer: 'Ne poți contacta prin email la support@sportstogo.com sau telefon la 0765 432 198.',
  },
];

const FAQPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', question: '' });

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', question: '' });
  };

  return (
    <Layout showTabs={false} showFooter={true}>
      <div className="faq-wrapper">
        <h1>Întrebări Frecvente</h1>
        
        <div className="faq-items">
          {faqList.map((item, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`question ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleDropdown(index)}
              >
                {item.question}
                <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
              </button>
              {openIndex === index && <div className="answer">{item.answer}</div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="faq-form">
          <h2>Ai o întrebare nouă?</h2>
          <input
            type="text"
            name="name"
            placeholder="Numele tău"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="question"
            placeholder="Scrie întrebarea ta aici..."
            rows={5}
            value={formData.question}
            onChange={handleChange}
            required
          />
          <button type="submit">Trimite</button>
        </form>
      </div>
    </Layout>
  );
};

export default FAQPage;