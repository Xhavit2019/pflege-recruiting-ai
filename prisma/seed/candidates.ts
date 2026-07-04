import { PrismaClient } from "@prisma/client";
import { createPasswordHash, randomFrom, randomInt } from "./helpers";
import type { LanguageLevel } from "@prisma/client";

const firstNames = [
  "Max","Anna","Julia","Thomas","Maria",
  "Michael","Sarah","Lukas","Emma","Daniel",
  "Arben","Xhavit","Ariana","Driton","Egzon",
  "Fatime","Leutrim","Besnik","Shkurte","Mimoza"
];

const lastNames = [
  "Müller","Schmidt","Fischer","Weber","Wagner",
  "Mustafa","Berisha","Krasniqi","Hoxha","Gashi",
  "Ivanov","Popescu","Yilmaz","Kowalski","Novak"
];

const professions = [
  "Pflegefachkraft",
  "Altenpfleger",
  "Gesundheits- und Krankenpfleger",
  "Pflegehelfer",
  "Intensivpfleger",
  "Kinderkrankenpfleger",
  "Wohnbereichsleitung"
];

const cities = [
  "Bayreuth",
  "Nürnberg",
  "Bamberg",
  "Erlangen",
  "München",
  "Regensburg"
];

const languageLevels: LanguageLevel[] = ["A2", "B1", "B2", "C1"];

export async function seedCandidates(prisma: PrismaClient) {

  const passwordHash = await createPasswordHash();

  const candidates = [];

  for (let i = 1; i <= 50; i++) {

    const firstName = randomFrom(firstNames);
    const lastName = randomFrom(lastNames);

    const email =
      `${firstName}.${lastName}.${i}@demo.de`
      .toLowerCase()
      .replaceAll("ä","ae")
      .replaceAll("ö","oe")
      .replaceAll("ü","ue");

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create:{
        name:`${firstName} ${lastName}`,
        email,
        passwordHash,
        role:"candidate"
      }
    });

    const profile = await prisma.candidateProfile.upsert({

      where:{
        userId:user.id
      },

      update:{},

      create:{
        userId:user.id,

        city:randomFrom(cities),

        phone:`0176${randomInt(1000000,9999999)}`,

        profession:randomFrom(professions),

        yearsOfExperience:randomInt(0,18),

        desiredSalary:randomInt(2800,4800),

        germanLevel:randomFrom(languageLevels),

        preferredIndustry:"care",

        expectedEmploymentType:"Vollzeit",

        skills:[
          "Grundpflege",
          "Dokumentation",
          "Teamfähigkeit"
        ]
      }
    });

    candidates.push(profile);

  }

  return candidates;

}