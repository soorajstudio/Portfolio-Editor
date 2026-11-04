export type SectionType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'timeline'
  | 'projects'
  | 'education'
  | 'cards'
  | 'text'
  | 'contact'

interface Base {
  id: string
  /** Label shown in the top navigation. Leave empty to hide the section from the nav. */
  navLabel: string
}

export interface Tag {
  text: string
  variant: '' | 'brass' | 'contour'
}

export interface HeroSection extends Base {
  type: 'hero'
  eyebrow: string
  /** Use *word* for brass emphasis and a new line for a line break. */
  headline: string
  sub: string
  tags: Tag[]
}

export interface AboutSection extends Base {
  type: 'about'
  num: string
  heading: string
  image: string | null
  captionLeft: string
  captionRight: string
  /** Use **word** for bold. */
  paragraphs: string[]
  stats: { label: string; value: string }[]
  hobbies: string[]
}

export interface SkillsSection extends Base {
  type: 'skills'
  num: string
  heading: string
  focus: { index: string; title: string; body: string }[]
  groups: { title: string; chips: string[] }[]
}

export interface TimelineSection extends Base {
  type: 'timeline'
  num: string
  heading: string
  items: { meta: string; title: string; org: string; body: string; current: boolean }[]
}

export interface ProjectItem {
  tag: string
  title: string
  body: string
  chips: string[]
  image: string | null
  /** Which built-in illustration to show when there is no uploaded image. */
  visual: string
}

export interface ProjectsSection extends Base {
  type: 'projects'
  num: string
  heading: string
  items: ProjectItem[]
}

export interface EducationSection extends Base {
  type: 'education'
  num: string
  heading: string
  rows: { period: string; title: string; sub: string; loc: string }[]
}

export interface CardItem {
  icon: string
  title: string
  sub: string
  body: string
  image: string | null
}

/** Generic card grid — used for certificates, achievements, awards, publications… */
export interface CardsSection extends Base {
  type: 'cards'
  num: string
  heading: string
  items: CardItem[]
}

export interface TextSection extends Base {
  type: 'text'
  num: string
  heading: string
  paragraphs: string[]
}

export interface ContactButton {
  label: string
  href: string
  variant: '' | 'primary' | 'secondary'
}

export interface ContactSection extends Base {
  type: 'contact'
  eyebrow: string
  heading: string
  sub: string
  buttons: ContactButton[]
  meta: string[]
}

export type Section =
  | HeroSection
  | AboutSection
  | SkillsSection
  | TimelineSection
  | ProjectsSection
  | EducationSection
  | CardsSection
  | TextSection
  | ContactSection

export interface Content {
  version: 1
  site: {
    title: string
    brand: string
    cta: string
    coords: string
    footerLeft: string
    footerRight: string
  }
  sections: Section[]
}

export type SetFn<T> = (fn: (s: T) => void) => void
export interface SectionProps<T> {
  s: T
  set: SetFn<T>
}
