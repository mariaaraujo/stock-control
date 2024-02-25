import { ObjectId } from 'mongodb'

import { Product, ProductDTO, ProductResponse, ResponseDTO } from '@/dtos'
import { database } from '@/config'

interface ProductInterface {
  create: (productDTO: ProductDTO) => Promise<ResponseDTO>
  update: (
    productId: string,
    productUpdateDTo: ProductDTO,
  ) => Promise<ResponseDTO>
  delete(productId: string): Promise<ResponseDTO>

  getById(productId: string): Promise<ProductResponse | null>

  get: (filter?: { name?: string }) => Promise<ResponseDTO>
}

export class ProductService implements ProductInterface {
  public async create(productDTO: ProductDTO): Promise<ResponseDTO> {
    try {
      const insertProduct = await database.collection('product').insertOne({
        name: productDTO?.name,
        price: productDTO?.price,
        quantity: productDTO?.quantity,
        createdAt: new Date(Date.now()),
        userId: new ObjectId(productDTO?.userId),
      })

      return { status: 200, message: insertProduct?.insertedId?.toHexString() }
    } catch (error) {
      console.error('Error to create product: ', error)

      return {
        status: 400,
        message: {
          error: 'Error to create product: ' + error,
        },
      }
    }
  }

  public async getById(productId: string): Promise<ProductResponse | null> {
    try {
      const productCursor = await database.collection('product').findOne({
        _id: new ObjectId(productId),
      })

      if (!productCursor) {
        console.error(`Product ${productId} not found`)
        return null
      }

      return {
        id: productCursor?._id.toHexString(),
        name: productCursor?.name,
        price: productCursor?.price,
        quantity: productCursor?.quantity,
        createdAt: productCursor?.createdAt,
        userId: productCursor?.userId,
      }
    } catch (error) {
      console.error(
        `Error to check if product is already registered with id ${productId}.`,
        error,
      )
      return null
    }
  }

  public async update(
    productId: string,
    productUpdateDTO: ProductDTO,
  ): Promise<ResponseDTO> {
    try {
      const productExists = await this.getById(productId)

      if (!productExists) {
        return this.handleError(
          `Error to update product ${productId}: Product not found`,
        )
      }

      const productResponse: Product = {
        id: productId,
        name: productUpdateDTO.name,
        price: productUpdateDTO.price,
        quantity: productUpdateDTO?.quantity,
        userId: productUpdateDTO?.userId,
      }

      await database.collection('product').updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $set: {
            name: productUpdateDTO.name,
            price: productUpdateDTO.price,
            quantity: productUpdateDTO?.quantity,
          },
        },
      )

      return { status: 200, message: productResponse }
    } catch (e) {
      console.error(`Error to update product ${productId}: `, e)
      return {
        status: 400,
        message: {
          error: `Error to update product ${productId}: ` + e,
        },
      }
    }
  }

  public async delete(productId: string): Promise<ResponseDTO> {
    try {
      const product = await this.getById(productId)

      if (!product) {
        return this.handleError(
          `Error to delete product ${productId}: Product not found`,
        )
      }

      await database.collection('product').deleteOne({
        _id: new ObjectId(productId),
      })

      return { status: 200, message: `Product ${productId} deleted` }
    } catch (e) {
      console.error(`Error to delete product ${productId}: `, e)
      return {
        status: 400,
        message: {
          error: `Error to delete product ${productId}: ` + e,
        },
      }
    }
  }

  public async get(filter?: { name?: string }): Promise<ResponseDTO> {
    try {
      const productsResponse = await database
        .collection('product')
        .find(filter!)
        // .sort(orderBy ?? {})
        .toArray()

      const products: ProductResponse[] = []

      for (const productResponse of productsResponse) {
        const product: ProductResponse = {
          id: productResponse._id.toHexString(),
          name: productResponse.name,
          price: productResponse.price,
          quantity: productResponse.quantity,
          createdAt: productResponse.createdAt,
          userId: productResponse.userId,
        }

        products.push(product)
      }

      return {
        status: 200,
        message: { total: products.length, products: products },
      }
    } catch (e) {
      console.error('Error to get products: ', e)
      return { status: 400, message: { error: 'Error to get products: ' + e } }
    }
  }

  private handleError(message: string, status: number = 400): ResponseDTO {
    console.error(message)
    return { status: status, message: message }
  }
}
