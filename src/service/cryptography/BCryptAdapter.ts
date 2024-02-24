import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashGenerator, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(data: string): Promise<string> {
    const saltRounds = await bcrypt.genSalt(this.salt)

    return bcrypt.hash(data, saltRounds)
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash)
  }
}

export interface HashGenerator {
  hash(data: string): Promise<string>
}

export interface HashComparer {
  compare(plaintext: string, hash: string): Promise<boolean>
}
