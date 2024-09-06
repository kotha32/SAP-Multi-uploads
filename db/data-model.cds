namespace miyasuta.media;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Book : cuid, managed {
    key ID: UUID;
    @title: 'Book ID'
    book_id: String(30);
    @title: 'Book Name'
    book_name: String(20);
    @title: 'Book Price'
    price: Decimal(15, 2);
    @title: 'Book Files'
    files: Association to Files;
}


entity Files: cuid, managed{
    @Core.MediaType: mediaType
    @Core.ContentDisposition.Filename: fileName
    @Core.ContentDisposition.Type: 'inline'
    content: LargeBinary;
    @Core.IsMediaType: true
    mediaType: String;
    fileName: String;
    size: Integer;
    url: String;
}