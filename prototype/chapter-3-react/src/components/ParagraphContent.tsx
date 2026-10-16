import { paragraph11 } from '../content/paragraph11'
import { Formula } from './Formula'

export function DefinitionBlock() {
  return (
    <section className="content-card definition-block">
      <span className="content-label">Определение</span>
      <Formula display>{'y=a^x,\\qquad a>0,\\ a\\ne1'}</Formula>
      <p>{paragraph11.definition}</p>
      <div className="step-rule">
        <Formula>{'a^{x+1}=a\\cdot a^x'}</Formula>
        <span>{paragraph11.stepRule}</span>
      </div>
    </section>
  )
}

export function PropertiesBlock() {
  return (
    <section className="properties-block">
      <div className="section-heading">
        <span className="content-label">Свойства</span>
        <h2>Что верно при любом допустимом основании</h2>
      </div>
      <dl>
        {paragraph11.properties.map((property, index) => (
          <div key={property.term}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <dt>{property.term}</dt>
            <dd>{property.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function ExampleBlock() {
  return (
    <section className="content-card example-block">
      <span className="content-label">Разобранный пример</span>
      <h2>{paragraph11.example.title}</h2>
      <p>{paragraph11.example.body}</p>
      <div className="example-sequence" aria-label="Значения функции два в степени икс">
        <span><small>x</small>0</span>
        <i aria-hidden="true">→</i>
        <span><small>x</small>1</span>
        <i aria-hidden="true">→</i>
        <span><small>x</small>2</span>
      </div>
      <div className="example-sequence example-sequence--values">
        <span><small>y</small>1</span>
        <i>× 2</i>
        <span><small>y</small>2</span>
        <i>× 2</i>
        <span><small>y</small>4</span>
      </div>
    </section>
  )
}

export function NotesBlock() {
  return (
    <section className="notes-block">
      <article>
        <span className="content-label">Граничный случай</span>
        <p>{paragraph11.boundary}</p>
      </article>
      <article>
        <span className="content-label">Типичная ошибка</span>
        <p>{paragraph11.commonError}</p>
      </article>
    </section>
  )
}
