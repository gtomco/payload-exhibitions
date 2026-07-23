import Image from 'next/image'
import React from 'react'

import type { IxMainContent } from '@/main-site/defaults'

type Props = {
  content: IxMainContent
}

function XMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.1 1.2h3.1L8 5.2l2.8-4h3.1L9.7 7.1 14.2 14.8h-3.2L8 9.4l-2.9 5.4H1.8L6.3 7.1 2.1 1.2z"
      />
    </svg>
  )
}

export function IxHomePage({ content }: Props) {
  const tickerWords = content.platforms.map((p) => p.tickerLabel || p.title).filter(Boolean)
  const ticker = [...tickerWords, ...tickerWords]

  return (
    <div className="ix-home">
      <section className="ix-hero" id="about">
        <div className="ix-wrap ix-hero__grid">
          <div>
            <p className="ix-label">{content.heroEyebrow}</p>
            <h1 className="ix-display ix-hero__title">
              {content.heroTitle} <span className="ix-x">{content.heroBrand}</span>
            </h1>
            <p className="ix-hero__copy">{content.heroBody}</p>
            <div className="ix-hero__actions">
              <a className="ix-btn ix-btn--solid" href="#events">
                {content.heroCtaPrimary} →
              </a>
              <a className="ix-btn ix-btn--ghost" href="#story">
                {content.heroCtaSecondary}
              </a>
            </div>
          </div>

          <div className="ix-hero__media">
            <Image
              src={content.heroImageUrl}
              alt={content.heroCaption || content.seoTitle}
              width={960}
              height={720}
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
              style={{ width: '100%', height: 'auto' }}
            />
            <div className="ix-hero__caption">
              <span className="ix-x">×</span>
              {content.heroCaption}
            </div>
          </div>
        </div>

        <div className="ix-ticker" aria-hidden="true">
          <div className="ix-ticker__track">
            {ticker.map((word, i) => (
              <span className="ix-ticker__item" key={`${word}-${i}`}>
                {word}
                <span className="ix-x">×</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="ix-stats" aria-label="Key figures">
        <div className="ix-wrap ix-stats__grid">
          {content.stats.map((stat) => (
            <div className="ix-stat" key={`${stat.value}-${stat.label}`}>
              <div className="ix-stat__value">{stat.value}</div>
              <div className="ix-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ix-story" id="story">
        <div className="ix-wrap ix-story__grid">
          <div>
            <p className="ix-label">{content.storyEyebrow}</p>
            <h2 className="ix-display ix-story__title">{content.storyTitle}</h2>
            <div className="ix-story__body">
              {content.storyBody.split(/\n\n+/).map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
            <div className="ix-story__cta">
              <a className="ix-text-link" href="#culture">
                {content.storyCta} <span>→</span>
              </a>
            </div>
          </div>
          <div className="ix-story__media">
            <Image
              src={content.storyImageUrl}
              alt={content.storyBadge || content.storyTitle}
              width={800}
              height={1000}
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ width: '100%', height: 'auto' }}
            />
            <div className="ix-story__badge">{content.storyBadge}</div>
          </div>
        </div>
      </section>

      <section className="ix-platforms" id="events">
        <div className="ix-wrap">
          <div className="ix-platforms__head">
            <div>
              <p className="ix-label">{content.platformsEyebrow}</p>
              <h2 className="ix-display ix-platforms__title">{content.platformsHeading}</h2>
            </div>
            <p className="ix-platforms__intro">{content.platformsIntro}</p>
          </div>

          {content.platforms.map((platform) => (
            <a
              key={platform.title}
              className="ix-platform"
              href={platform.href}
              target={platform.external ? '_blank' : undefined}
              rel={platform.external ? 'noopener noreferrer' : undefined}
            >
              {platform.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ix-platform__logo" src={platform.logoUrl} alt={`${platform.title} logo`} />
              ) : (
                <XMark className="ix-platform__mark" />
              )}
              <div>
                <div className="ix-platform__title">{platform.title}</div>
                <div className="ix-platform__sub">{platform.subtitle}</div>
              </div>
              <span className="ix-platform__arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}

          <div className="ix-platforms__more">
            <a className="ix-text-link" href="#events">
              {content.platformsSeeAll} <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="ix-services" id="services">
        <div className="ix-wrap">
          <p className="ix-label">{content.servicesEyebrow}</p>
          <h2 className="ix-display ix-services__title">{content.servicesHeading}</h2>
          <div className="ix-services__grid">
            {content.services.map((service) => (
              <article key={service.title} className="ix-service">
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                {service.cta ? (
                  <a className="ix-text-link" href={service.href}>
                    {service.cta} <span>→</span>
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ix-culture" id="culture">
        <div className="ix-culture__quote" aria-hidden="true">
          “
        </div>
        <div className="ix-culture__bgx" aria-hidden="true">
          X
        </div>
        <div className="ix-wrap ix-culture__inner">
          <p className="ix-label ix-label--orange">{content.cultureEyebrow}</p>
          <h2 className="ix-display ix-culture__title">
            {content.cultureTitleBefore}{' '}
            <span className="ix-x">{content.cultureTitleAccent}</span>
          </h2>
          <p className="ix-culture__body">{content.cultureBody}</p>
          <div className="ix-culture__team">
            <div className="ix-avatars" aria-hidden="true">
              {content.team.slice(0, 5).map((member) => (
                <span key={member.name}>{member.initials}</span>
              ))}
            </div>
            <a className="ix-text-link" href="#team">
              {content.cultureMeetTeam} <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {content.cultureValues.length ? (
        <section className="ix-values">
          <div className="ix-wrap">
            <div className="ix-values__grid">
              {content.cultureValues.map((value) => (
                <article key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                </article>
              ))}
            </div>
            <div className="ix-mission">
              <h3>{content.missionTitle}</h3>
              <p>{content.missionBody}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="ix-team" id="team">
        <div className="ix-wrap">
          <p className="ix-label">{content.cultureMeetTeam}</p>
          <div className="ix-team__grid">
            {content.team.map((member) => (
              <article key={member.name} className="ix-team-card">
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photoUrl} alt={member.name} />
                ) : (
                  <div className="ix-team-card__avatar" aria-hidden="true">
                    {member.initials}
                  </div>
                )}
                <p className="ix-team-card__name">{member.name}</p>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ix-film">
        <div className="ix-wrap">
          <a
            className="ix-film__card"
            href={content.filmUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ix-film__play" aria-hidden="true">
              ▶
            </span>
            <div>
              <p className="ix-label ix-label--orange">{content.filmEyebrow}</p>
              <h2 className="ix-display ix-film__title">{content.filmTitle}</h2>
            </div>
            <div className="ix-film__meta">{content.filmMeta}</div>
          </a>
        </div>
      </section>

      <section className="ix-news" id="news">
        <div className="ix-wrap">
          <div className="ix-news__head">
            <div>
              <p className="ix-label ix-label--orange">{content.newsEyebrow}</p>
              <h2 className="ix-display ix-news__title">{content.newsHeading}</h2>
            </div>
            <a className="ix-text-link" href="#videos">
              {content.newsAllLabel} <span>→</span>
            </a>
          </div>
          <div className="ix-news__grid">
            {content.newsItems.map((card) => {
              const inner = (
                <>
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    width={640}
                    height={400}
                    sizes="(max-width: 900px) 100vw, 30vw"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <div className="ix-news-card__cat">{card.category}</div>
                  <p className="ix-news-card__title">{card.title}</p>
                  <p className="ix-news-card__body">{card.body}</p>
                </>
              )
              return card.href ? (
                <a
                  className="ix-news-card"
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <article className="ix-news-card" key={card.title}>
                  {inner}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {content.videos.length ? (
        <section className="ix-videos" id="videos">
          <div className="ix-wrap">
            <p className="ix-label ix-label--orange">Videos</p>
            <div className="ix-videos__grid">
              {content.videos.map((video) => (
                <a
                  key={video.youtubeUrl}
                  className="ix-video-card"
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      video.coverUrl ||
                      `https://i.ytimg.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0] || ''}/hqdefault.jpg`
                    }
                    alt={video.title}
                  />
                  <span className="ix-video-card__play" aria-hidden="true">
                    ▶
                  </span>
                  <p className="ix-video-card__title">{video.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
