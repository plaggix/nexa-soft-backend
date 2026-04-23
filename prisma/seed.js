const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contact.deleteMany();

  // Create Services
  const webService = await prisma.service.create({
    data: {
      title: 'Développement Web',
      description:
        'Nous concevons des applications web modernes, performantes et scalables. De la landing page au SaaS complexe, nous maîtrisons React, Next.js, Node.js et les architectures cloud.',
      icon_name: 'Globe',
    },
  });

  const mobileService = await prisma.service.create({
    data: {
      title: 'Applications Mobiles',
      description:
        "Développement d'applications iOS et Android natives ou cross-platform avec React Native et Flutter. UX soignée, performances optimales et intégration API complète.",
      icon_name: 'Smartphone',
    },
  });

  const softwareService = await prisma.service.create({
    data: {
      title: 'Logiciels Métier',
      description:
        "Solutions logicielles sur mesure adaptées à vos processus métier. ERP, CRM, outils de gestion interne — nous automatisons et digitalisons votre activité.",
      icon_name: 'Code2',
    },
  });

  const aiService = await prisma.service.create({
    data: {
      title: 'Intelligence Artificielle',
      description:
        "Intégration de solutions IA dans vos produits : chatbots intelligents, analyse prédictive, traitement du langage naturel et automatisation par machine learning.",
      icon_name: 'Brain',
    },
  });

  const cloudService = await prisma.service.create({
    data: {
      title: 'Cloud & DevOps',
      description:
        "Architecture cloud AWS/GCP/Azure, CI/CD pipelines, containerisation Docker/Kubernetes. Nous garantissons disponibilité, sécurité et scalabilité de vos infrastructures.",
      icon_name: 'Cloud',
    },
  });

  const designService = await prisma.service.create({
    data: {
      title: 'UI/UX Design',
      description:
        "Design d'interfaces utilisateur élégantes et intuitives. Prototypage Figma, design systems, tests utilisateurs — nous créons des expériences mémorables.",
      icon_name: 'Palette',
    },
  });

  // Create Projects — Portfolio réel
  await prisma.project.createMany({
    data: [
      {
        name: 'SIG SARL',
        description:
          'Site vitrine complet pour SIG SARL (Solutions Informatiques et de Gestion) — Yaoundé, Cameroun. Présentation des services : MATRIIX ERP, réseaux, télécommunication, tracking GPS, bases de données et maintenance informatique.',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        service_id: webService.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('   - 6 services créés');
  console.log('   - 1 projet créé : SIG SARL');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
