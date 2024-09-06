using { sumanth.media as db } from '../db/data-model';

service Attachments {
    entity Book as projection on db.Book;
    entity Files as projection on db.Files

}

annotate Attachments.Book with @odata.draft.enabled;

annotate Attachments.Book with @(
    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Label: 'Book ID',
            Value: book_id
        },
        {
            $Type: 'UI.DataField',
            Label: 'Book Name',
            Value: book_name
        },
        {
            $Type: 'UI.DataField',
            Label: 'Book Price',
            Value: price
        }
    ],
    UI.FieldGroup #BookInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Label: 'Book ID', Value: book_id },
            { Label: 'Book Name', Value: book_name },
            { Label: 'Book Price', Value: price }
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'BookFacet',
            Label : 'Book Information',
            Target : '@UI.FieldGroup#BookInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'attachmentsFacet',
            Label : 'Attachments',
            Target : 'files/@UI.LineItem',
        }
    ],
);

annotate Attachments.Files with @(
    UI.LineItem: [
        { Label: 'File Name', Value: fileName },
        { Label: 'Media Type', Value: mediaType },
        { Label: 'Size (Bytes)', Value: size },
        { Label: 'URL', Value: url }
    ],
    UI.FieldGroup #AttachmentsInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Label: 'File Name', Value: fileName },
            { Label: 'Media Type', Value: mediaType },
            { Label: 'Size (Bytes)', Value: size },
            { Label: 'URL', Value: url }
        ]
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'attachmentInfoFacet',
            Label : 'Attachment Information',
            Target : '@UI.FieldGroup#AttachmentsInformation',
        }
    ],
);