import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG, localBusinessSchema } from '../../utils/seo';

const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  breadcrumbs,
  schemaMarkup,
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle;
  const metaDesc = description || SEO_CONFIG.defaultDescription;
  const canonicalUrl = canonical ? `${SEO_CONFIG.siteUrl}${canonical}` : SEO_CONFIG.siteUrl;
  const image = ogImage || SEO_CONFIG.defaultImage;

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SEO_CONFIG.siteUrl}${item.href}`,
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* Local SEO */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Gorakhpur" />
      <meta name="geo.position" content="26.7606;83.3732" />
      <meta name="ICBM" content="26.7606, 83.3732" />

      {/* Schema.org Local Business */}
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
      {schemaMarkup && (
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
