## deltaDAO Tech Challenge

My goal was to display the list of all available resources from querying Aquarius.
The table layout can accommodate many results, but the available resources were more than 400, for this reason I thought it would be useful to take advantage of the pagination system built in the Search template to display only one page of results at the time.

- Added the new catalog page to site.json to be able to navigate to it
- Reutilized the AssetType component to add a new column to the structure of the bookmarks keeping the familiar style of the rest of the website
- Created a new PageGatsbyCatalog (based on the structure of PageGatsbyHistory to display title and description)
- Created a new CatalogPage (based on the Search template) to reutilize the Pagination component for querying Aquarius
- Simplified the Bookmark component into CatalogTable leaving only the table structure and passing the data as props
- Set the default paginationPerPage property in the CatalogTable to be equal to the length of the data length (to avoid to show a double list of page numbers under the list)
