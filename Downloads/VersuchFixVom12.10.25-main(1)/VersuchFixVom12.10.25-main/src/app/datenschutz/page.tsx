"use client";

import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

export default function DatenschutzPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 transition-colors">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-8">
              Datenschutzerklärung
            </h1>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8 space-y-8">
              {/* Einleitung */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  1. Datenschutz auf einen Blick
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und
                  behandeln Ihre personenbezogenen Daten vertraulich und
                  entsprechend der gesetzlichen Datenschutzvorschriften sowie
                  dieser Datenschutzerklärung.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Die Nutzung unserer Website ist in der Regel ohne Angabe
                  personenbezogener Daten möglich. Soweit auf unseren Seiten
                  personenbezogene Daten erhoben werden, erfolgt dies, soweit
                  möglich, stets auf freiwilliger Basis.
                </p>
              </section>

              {/* Verantwortlicher */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Verantwortlicher
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Restaurant ALAS
                  <br />
                  Christos Fourakis
                  <br />
                  Bundesstr. 39
                  <br />
                  94554 Moos, Niederbayern
                  <br />
                  <br />
                  Telefon:{" "}
                  <a
                    href="tel:+4999382320307"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    09938 2320307
                  </a>
                  <br />
                  E-Mail:{" "}
                  <a
                    href="mailto:info@restaurant-alas.de"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    info@restaurant-alas.de
                  </a>
                </p>
              </section>

              {/* Datenerfassung */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. Datenerfassung auf unserer Website
                </h2>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-4">
                  3.1 Server-Log-Dateien
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Der Provider der Seiten erhebt und speichert automatisch
                  Informationen in sogenannten Server-Log-Dateien, die Ihr
                  Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>IP-Adresse (anonymisiert)</li>
                  <li>Uhrzeit der Serveranfrage</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Diese Daten sind nicht bestimmten Personen zuordenbar. Eine
                  Zusammenführung dieser Daten mit anderen Datenquellen wird
                  nicht vorgenommen. Die Daten werden nach einer statistischen
                  Auswertung nach 30 Tagen gelöscht.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-6">
                  3.2 IP-Adressen und Statistiken
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  <strong>
                    Wir erfassen anonymisierte IP-Adressen zur statistischen
                    Auswertung.
                  </strong>{" "}
                  Die letzten beiden Blöcke Ihrer IP-Adresse werden vor der
                  Speicherung entfernt (z.B. 192.168.0.0).
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Zweck der Erfassung:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>Verbesserung der Benutzerfreundlichkeit</li>
                  <li>Optimierung unserer Inhalte</li>
                  <li>Erkennung technischer Probleme</li>
                  <li>Statistische Auswertungen</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Speicherdauer:</strong> 90 Tage
                  <br />
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-6">
                  3.3 Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Unsere Website verwendet Cookies. Das sind kleine Textdateien,
                  die Ihr Browser automatisch erstellt und die auf Ihrem
                  Endgerät gespeichert werden.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Wir verwenden ausschließlich technisch notwendige Cookies:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>
                    <strong>Session-Cookies:</strong> Werden nach
                    Browser-Schließung automatisch gelöscht
                  </li>
                  <li>
                    <strong>Theme-Präferenz:</strong> Speichert Ihre Einstellung
                    für Hell-/Dunkel-Modus (1 Jahr)
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  Sie können Ihren Browser so einstellen, dass Sie über das
                  Setzen von Cookies informiert werden und einzeln über deren
                  Annahme entscheiden.
                </p>
              </section>

              {/* Kontaktaufnahme */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Kontaktaufnahme
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Bei der Kontaktaufnahme mit uns (z.B. per Telefon, E-Mail)
                  werden die Angaben des Nutzers zur Bearbeitung der
                  Kontaktanfrage und deren Abwicklung gemäß Art. 6 Abs. 1 lit. b
                  DSGVO verarbeitet.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Folgende Daten werden bei einer Kontaktaufnahme erhoben:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>
                    Name und Telefonnummer (bei telefonischer Kontaktaufnahme)
                  </li>
                  <li>E-Mail-Adresse (bei E-Mail-Kontakt)</li>
                  <li>Inhalt der Anfrage</li>
                  <li>Datum und Uhrzeit der Kontaktaufnahme</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Löschung:</strong> Wir löschen die Anfragen, sofern
                  diese nicht mehr erforderlich sind. Wir überprüfen die
                  Erforderlichkeit alle zwei Jahre.
                </p>
              </section>

              {/* Tischreservierungen */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Tischreservierungen
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  <strong>
                    Reservierungen werden bei uns ausschließlich telefonisch
                    entgegengenommen.
                  </strong>
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Bei einer Reservierung erheben wir folgende Daten:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>Vor- und Nachname</li>
                  <li>Telefonnummer für Rückfragen</li>
                  <li>Gewünschtes Datum und Uhrzeit</li>
                  <li>Anzahl der Personen</li>
                  <li>Besondere Wünsche (z.B. Allergien, Anlass)</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Speicherdauer:</strong> 30 Tage nach dem
                  Reservierungstermin
                  <br />
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
                </p>
              </section>

              {/* SSL-Verschlüsselung */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. SSL-/TLS-Verschlüsselung
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
                  Übertragung vertraulicher Inhalte eine
                  SSL-/TLS-Verschlüsselung.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Eine verschlüsselte Verbindung erkennen Sie daran, dass die
                  Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt
                  und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können
                  die Daten, die Sie an uns übermitteln, nicht von Dritten
                  mitgelesen werden.
                </p>
              </section>

              {/* Ihre Rechte */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  7. Ihre Rechte als betroffene Person
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie
                  betreffenden personenbezogenen Daten:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>
                    <strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)
                  </li>
                  <li>
                    <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)
                  </li>
                  <li>
                    <strong>Recht auf Löschung</strong> (Art. 17 DSGVO)
                  </li>
                  <li>
                    <strong>Recht auf Einschränkung der Verarbeitung</strong>{" "}
                    (Art. 18 DSGVO)
                  </li>
                  <li>
                    <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20
                    DSGVO)
                  </li>
                  <li>
                    <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)
                  </li>
                  <li>
                    <strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7
                    Abs. 3 DSGVO)
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>
                    Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
                  </strong>
                  <br />
                  E-Mail: info@restaurant-alas.de
                  <br />
                  Telefon: 09938 2320307
                  <br />
                  Post: Restaurant ALAS, Bundesstr. 39, 94554 Moos
                </p>
              </section>

              {/* Beschwerderecht */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  8. Beschwerderecht bei der Aufsichtsbehörde
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Sie haben das Recht, sich bei einer
                  Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
                  personenbezogenen Daten durch uns zu beschweren.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Die für uns zuständige Aufsichtsbehörde ist:
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>
                    Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
                  </strong>
                  <br />
                  Promenade 18
                  <br />
                  91522 Ansbach
                  <br />
                  <br />
                  Telefon: 0981 / 180093-0
                  <br />
                  Telefax: 0981 / 180093-800
                  <br />
                  E-Mail: poststelle@lda.bayern.de
                  <br />
                  Website:{" "}
                  <a
                    href="https://www.lda.bayern.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    www.lda.bayern.de
                  </a>
                </p>
              </section>

              {/* Externe Dienste */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  9. Externe Dienste und Soziale Medien
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Unsere Website enthält Verlinkungen zu externen Diensten und
                  sozialen Netzwerken:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 mb-3">
                  <li>
                    <strong>Facebook:</strong> Beim Anklicken des Links werden
                    Sie zu Facebook weitergeleitet. Es gelten die
                    Datenschutzbestimmungen von Meta Platforms Ireland Limited.
                  </li>
                  <li>
                    <strong>Instagram:</strong> Beim Anklicken des Links werden
                    Sie zu Instagram weitergeleitet. Es gelten die
                    Datenschutzbestimmungen von Meta Platforms Ireland Limited.
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Hinweis:</strong> Wir haben keinen Einfluss auf den
                  Umfang der Daten, die diese Plattformen erheben und
                  verarbeiten.
                </p>
              </section>

              {/* Aktualität */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  10. Aktualität und Änderung dieser Datenschutzerklärung
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Diese Datenschutzerklärung ist aktuell gültig und hat den
                  Stand:{" "}
                  {new Date().toLocaleDateString("de-DE", {
                    month: "long",
                    year: "numeric",
                  })}
                  .
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Durch die Weiterentwicklung unserer Website und Angebote oder
                  aufgrund geänderter gesetzlicher beziehungsweise behördlicher
                  Vorgaben kann es notwendig werden, diese Datenschutzerklärung
                  zu ändern. Die jeweils aktuelle Datenschutzerklärung kann
                  jederzeit auf der Website unter
                  https://restaurant-alas.de/datenschutz von Ihnen abgerufen und
                  ausgedruckt werden.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
