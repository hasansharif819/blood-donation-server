import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

// Runs every day at midnight (use */2 * * * * for testing)
cron.schedule("0 0 * * *", async () => {
  // cron.schedule("*/2 * * * *", async () => {
  console.log("⏰ Running availability update task...");

  try {
    const users = await prisma.user.findMany({
      include: {
        userProfile: true,
      },
    });

    const updates = users.map(async (user) => {
      const lastDonationDate = user.userProfile?.lastDonationDate;

      console.log(
        `Checking user ${user.id}... Last donation date: ${lastDonationDate}`
      );

      let shouldBeAvailable: boolean;

      if (!lastDonationDate) {
        // If no donation date, mark as available
        shouldBeAvailable = true;
      } else {
        const daysSince = dayjs().diff(dayjs(lastDonationDate), "day");
        shouldBeAvailable = daysSince >= 120;
      }

      // Only update if current availability is incorrect
      if (user.availability !== shouldBeAvailable) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            availability: shouldBeAvailable,
          },
        });

        console.log(
          `✅ Updated user ${user.id}: availability → ${shouldBeAvailable}`
        );
      }
    });

    await Promise.all(updates);
    console.log("✅ Availability update completed.");
  } catch (error) {
    console.error("❌ Error during availability update:", error);
  }
});
