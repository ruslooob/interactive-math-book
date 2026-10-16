import type { ExampleData, NoteData, ParagraphData, PropertyItem } from '../content/chapter3'
import { Formula } from './Formula'

function ExplanationHint({ children }: { children: string }) {
  return (
    <span className="explanation-hint" tabIndex={0} aria-label={children}>
      <span aria-hidden="true">?</span>
      <span role="tooltip">{children}</span>
    </span>
  )
}

export function PropertiesBlock({ title, properties }: { title: string; properties: PropertyItem[] }) {
  return (
    <section className="properties-block">
      <div className="section-heading">
        <span className="content-label">Свойства</span>
        <h2>{title}</h2>
      </div>
      <ul className="property-list">
        {properties.map((property) => (
          <li key={property.term}>
            <div className="property-line">
              <strong>{property.term}:</strong>
              <Formula>{property.formula}</Formula>
              <ExplanationHint>{property.explanation}</ExplanationHint>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ExampleBlock({ example }: { example: ExampleData }) {
  return (
    <section className="example-block">
      <div className="section-heading">
        <span className="content-label">Пример</span>
        <h2>{example.title}</h2>
      </div>
      {example.formula && <Formula display>{example.formula}</Formula>}
      {example.table && (
        <table>
          <tbody>
            {example.table.values.map((row, rowIndex) => (
              <tr key={example.table?.labels[rowIndex]}>
                <th scope="row">{example.table?.labels[rowIndex]}</th>
                {row.map((value, index) => <td key={`${rowIndex}-${index}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {example.steps && (
        <ol className="example-steps">
          {example.steps.map((step, index) => (
            <li key={`${step.formula}-${index}`}>
              <Formula>{step.formula}</Formula>
              {step.note && <span>{step.note}</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function NotesBlock({ notes }: { notes: NoteData[] }) {
  return (
    <section className="notes-block">
      {notes.map((note) => (
        <article key={note.title}>
          <span className="attention-icon" aria-hidden="true">!</span>
          <div>
            <strong>{note.title}</strong>
            <p>{note.text}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export function ParagraphConclusion({ paragraph }: { paragraph: ParagraphData }) {
  return (
    <>
      <PropertiesBlock title={paragraph.propertiesTitle} properties={paragraph.properties} />
      <NotesBlock notes={paragraph.notes} />
    </>
  )
}
