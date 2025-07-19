import dynamoose from 'dynamoose';
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import { TableServiceInterface } from './interface/tableServiceInterface';
import {
  CreateTableItemMethodInput,
  QueryTableItemMethodInput,
  TableKeyType,
  UpdateTableItemMethodInput,
} from './types/tableServiceTypes';
import isTest from '../../../commons/utils/isTest';

/**
 * Clase TableService que implementa la interfaz TableServiceInterface.
 * Esta clase se utiliza para interactuar con una tabla en DynamoDB.
 */
export default class TableService implements TableServiceInterface {
  private modelType!: ModelType<AnyItem>;

  /**
   * Constructor de la clase TableService.
   * @param {Schema | SchemaDefinition} schema - El esquema de la tabla.
   * @param {string} tableName - El nombre de la tabla.
   */
  constructor(schema: Schema | SchemaDefinition, tableName: string) {
    if (isTest) {
      dynamoose.aws.ddb.local(process.env.LOCALHOST);
      console.log('IS TEST');
    }

    this.modelType = dynamoose.model('Item', schema, {
      tableName,
      create: false,
      waitForActive: false,
    });
  }

  /**
   * Crea un nuevo elemento en la tabla.
   * @param data Objeto con los datos a guardar en la tabla.
   * @returns Promesa con el resultado de la operación de guardado.
   */
  async create(data: CreateTableItemMethodInput) {
    const model = new this.modelType(data);
    return model.save();
  }

  /**
   * Realiza una consulta a la tabla DynamoDB.
   * @param params Parámetros de consulta, incluyendo query y opciones.
   * @returns Promesa con los resultados de la consulta en formato JSON.
   */
  async query(params: QueryTableItemMethodInput) {
    const Model = this.modelType.query(params.query);

    if (params.options?.using_index) {
      Model.using(params.options.using_index);
    }

    const response = await Model.exec();

    if (!response) return undefined;

    return response.map((item) => item.toJSON());
  }

  /**
   * Actualiza un elemento existente en la tabla.
   * @param params Parámetros con la clave y los datos a actualizar.
   * @returns Promesa con el elemento actualizado o undefined si no existe.
   */
  async update(params: UpdateTableItemMethodInput) {
    const response = (
      await this.modelType.update(params.key, params.payload, {
        returnValues: 'ALL_NEW',
      })
    ).toJSON();

    if (!response) return undefined;

    return response;
  }

  /**
   * Elimina un elemento de la tabla por su clave.
   * @param params Clave primaria del elemento a eliminar.
   * @returns Promesa que resuelve en true si la eliminación fue exitosa.
   */
  async delete(params: TableKeyType) {
    await this.modelType.delete(params);

    return true;
  }
}
