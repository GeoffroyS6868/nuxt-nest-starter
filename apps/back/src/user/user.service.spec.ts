import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import { USER_REPOSITORY } from "./domain/user.repository.interface";
import { User } from "./domain/user.entity";

describe("UserService", () => {
  let service: UserService;
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByGoogleId: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    existsByEmail: jest.fn(),
    existsByUserName: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: USER_REPOSITORY, useValue: userRepository }],
    }).compile();

    service = module.get(UserService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("persists a new user", async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userRepository.save.mockImplementation(async (user: User) => {
        user.id = "user-1";
      });

      const created = await service.create({
        email: "new@example.com",
        password: "Password1!",
        userName: "newbie",
      });

      expect(created.email).toBe("new@example.com");
      expect(created.userName).toBe("newbie");
      expect(created.password).toBeTruthy();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it("throws ConflictException when email already exists", async () => {
      userRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        service.create({
          email: "taken@example.com",
          password: "Password1!",
          userName: "taken",
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("updateUserName", () => {
    it("updates the username when it is available", async () => {
      const user = new User("a@b.com", "alice", "hash");
      user.id = "user-1";
      userRepository.findById.mockResolvedValue(user);
      userRepository.existsByUserName.mockResolvedValue(false);

      const updated = await service.updateUserName("user-1", "alice2");

      expect(updated.userName).toBe("alice2");
      expect(userRepository.existsByUserName).toHaveBeenCalledWith("alice2", "user-1");
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it("throws NotFoundException when the user does not exist", async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.updateUserName("missing", "name")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
