import { EntitiesEnum } from '../../../commons/enums/entitiesEnum';
import { TableGsiEnum } from '../../../commons/enums/tableGsiEnum';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import Metadata from '../../../domain/entities/metadata/metadata';
import { MetadataEntity } from '../../../domain/entities/metadata/types/metadataTypes';
import { TableItemDynamooseSchema } from '../schemas/tableDynamooseSchema';
import { Placeholders } from '../utils/placeholders';
import {
  MetadataItem,
  MetadataRepositoryInterface,
} from './interfaces/metadataRepositoryInterface';
import TableRepository from './tableRepository';

const tableName = process.env.FILES_METADATA_TABLE_NAME as string;

/**
 * MetadataRepository es responsable de manejar la persistencia de los metadatos de los archivos.
 * Utiliza DynamoDB como base de datos y sigue el patrón de repositorio.
 * Implementa la interfaz MetadataRepositoryInterface.
 */
export default class MetadataRepository implements MetadataRepositoryInterface {
  protected schema = TableItemDynamooseSchema;

  private readonly pk = `${EntitiesEnum.FILE}#${Placeholders.ID}`;

  private readonly sk = `UPLOADER#${Placeholders.ID}`;

  private readonly type = EntitiesEnum.FILE;

  /**
   * Almacena los metadatos de un archivo en la base de datos.
   * @param metadata - Objeto Metadata que contiene los metadatos del archivo.
   * @returns El objeto Metadata almacenado, sin los campos pk, sk y type.
   * @throws Error si ocurre un problema al almacenar los metadatos.
   */
  async store(metadata: Metadata) {
    const tableService = new TableRepository().getInstance(
      this.getTableSchema(),
      tableName
    );

    const fileItem = {
      pk: this.pk.replace(Placeholders.ID, metadata.id),
      sk: this.sk.replace(Placeholders.ID, metadata.uploaderId),
      type: this.type,
      ...metadata,
    };

    await tableService.create(fileItem);

    return this.clearItem(fileItem);
  }

  /**
   * Recupera los metadatos de un archivo por su ID.
   * @param id - El ID del archivo.
   * @returns Los metadatos del archivo.
   * @throws Error si no se encuentran los metadatos.
   */
  async get(id: string) {
    const response = await this.search({
      query: {
        id: {
          eq: id,
        },
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.METADATA_NOT_FOUND);
    }

    const [item] = response;

    return item;
  }

  /**
   * Busca metadatos de archivos en la base de datos.
   * @param params - Parámetros de búsqueda opcionales.
   * @returns Una lista de metadatos que coinciden con los criterios de búsqueda.
   * @throws Error si no se encuentran metadatos.
   */
  async search(params?: { query?: any }) {
    const tableService = new TableRepository().getInstance(
      this.getTableSchema(),
      tableName
    );

    const response = await tableService.query({
      query: {
        type: {
          eq: EntitiesEnum.FILE,
        },
        ...(params?.query && params?.query),
      },
      options: {
        using_index: TableGsiEnum.TYPE,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.METADATA_NOT_FOUND);
    }

    return response.map((item) => this.clearItem(item));
  }

  /**
   * Elimina los metadatos de un archivo por su ID.
   * @param templateId - El ID del archivo a eliminar.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(deleteDTO: { id: string; uploaderId: string }) {
    const tableService = new TableRepository().getInstance(
      this.getTableSchema(),
      tableName
    );

    const keys = {
      pk: this.pk.replace(Placeholders.ID, deleteDTO.id),
      sk: this.sk.replace(Placeholders.ID, deleteDTO.uploaderId),
    };

    await tableService.delete(keys);
    throw new Error('Method not implemented.');
  }

  /**
   * Actualiza los metadatos de un archivo.
   * @param updateDTO - Objeto con los campos a actualizar.
   * @returns Los metadatos actualizados.
   * @throws Error si ocurre un problema al actualizar los metadatos.
   */
  async update(updateDTO: Partial<MetadataEntity>) {
    const updatedDTO = structuredClone(updateDTO);

    const keys = {
      pk: this.pk.replace(Placeholders.ID, updatedDTO.id as string),
      sk: this.sk.replace(Placeholders.ID, updatedDTO.uploaderId as string),
    };

    const tableService = new TableRepository().getInstance(
      this.getTableSchema(),
      tableName
    );

    const updatedLicense = await tableService.update({
      key: keys,
      payload: updatedDTO,
    });

    return updatedLicense;
  }

  private getTableSchema() {
    return this.schema;
  }

  private clearItem(item: MetadataItem): MetadataEntity {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pk, sk, type, ...cleanedItem } = item;
    return structuredClone(cleanedItem) as MetadataEntity;
  }
}
