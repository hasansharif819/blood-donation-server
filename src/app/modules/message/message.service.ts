import prisma from "../../../shared/prisma";

const getMessagesByConversationId = async (
  conversationId: string,
  page: number = 1,
  limit: number = 30
) => {
  const skip = (page - 1) * limit;

  // Fetch participants only once (not paginated)
  const participants = await prisma.participant.findMany({
    where: {
      conversationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  });

  // Fetch paginated messages with sender info
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" }, // newest messages first
      skip,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    }),
    prisma.message.count({
      where: { conversationId },
    }),
  ]);

  return {
    data: {
      participants,
      messages,
    },
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

export const messageService = {
  getMessagesByConversationId,
};
