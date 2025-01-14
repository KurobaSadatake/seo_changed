import { useState } from 'react';
import Head from 'next/head';

import Fuse from 'fuse.js';
import _ from 'lodash';

import styles from '../styles/Home.module.css';
import CodeSampleModal from '../components/CodeSampleModal';

export default function Start({ countries }) {
  const [results, setResults] = useState(countries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fuse = new Fuse(countries, {
    keys: ['name'],
    threshold: 0.3,
  });

  return (
    <div>
      <Head>
        <title>Next Test</title>
        <meta name="description" content="Core web vitals walk through" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.container}>
        <div>
          <h2 className={styles.secondaryHeading}>Population Lookup</h2>
          <input
            type="text"
            placeholder="Country search..."
            className={styles.input}
            onChange={async (e) => {
              const { value } = e.currentTarget;

              const searchResult = fuse
                .search(value)
                .map((result) => result.item);

              const updatedResults = searchResult.length
                ? searchResult
                : countries;
              setResults(updatedResults);

              // Fake analytics hit
              console.info({
                searchedAt: _.now(),
              });
            }}
          />

          <ul className={styles.countries}>
            {results.map((country) => (
              <li key={country.cca2} className={styles.country}>
                <p>
                  {country.name} - {country.population.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.codeSampleBlock}>
          <h2 className={styles.secondaryHeading}>Code Sample</h2>
          <p>Ever wondered how to write a function that prints Hello World?</p>
          <button onClick={() => setIsModalOpen(true)}>Show Me</button>
          <CodeSampleModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries = await response.json();

  return {
    props: {
      countries: countries.map((country) => ({
        name: country.name.common,
        cca2: country.cca2,
        population: country.population,
      })),
    },
  };
}
