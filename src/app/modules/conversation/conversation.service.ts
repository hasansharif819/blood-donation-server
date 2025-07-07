import prisma from "../../../shared/prisma";

const createConversation = async (data: any) => {
  interface CreateConversationData {
    name?: string;
    members: string[];
  }

  interface Conversation {
    id: string;
    name: string | null;
    participants: Participant[];
    // Add other fields as needed
  }

  interface Participant {
    id: string;
    userId: string;
    conversationId: string;
    user: User;
    // Add other fields as needed
  }

  interface User {
    id: string;
    // Add other fields as needed
  }

  const conversation: Conversation = await prisma.conversation.create({
    data: {
      name: (data as CreateConversationData).name || null,
      participants: {
        create: (data as CreateConversationData).members.map(
          (userId: string) => ({
            user: { connect: { id: userId } },
          })
        ),
      },
    },
    include: {
      participants: {
        include: { user: true },
      },
    },
  });

  return conversation;
};

const getConversationsByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.conversation.count({
      where: {
        participants: {
          some: { userId },
        },
      },
    }),
  ]);

  return {
    data: conversations,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

const getConversationById = async (conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: { user: true },
      },
      messages: {
        include: { sender: true },
      },
    },
  });

  return conversation;
};

const addParticipantToConversation = async (
  conversationId: string,
  userId: string
) => {
  const participant = await prisma.participant.create({
    data: {
      conversation: { connect: { id: conversationId } },
      user: { connect: { id: userId } },
    },
  });

  return participant;
};

const removeParticipantFromConversation = async (
  conversationId: string,
  userId: string
) => {
  // First, find the participant by conversationId and userId
  const participant = await prisma.participant.findFirst({
    where: {
      conversationId,
      userId,
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  // Then, delete by the participant's unique id
  const deletedParticipant = await prisma.participant.delete({
    where: {
      id: participant.id,
    },
  });

  return deletedParticipant;
};

export const conversationService = {
  createConversation,
  getConversationsByUserId,
  getConversationById,
  addParticipantToConversation,
  removeParticipantFromConversation,
};
