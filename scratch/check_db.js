const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lastAnalyses = await prisma.analysis.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
  console.log(JSON.stringify(lastAnalyses, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
