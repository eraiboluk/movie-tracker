using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexToMovie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Movies_UserId_TmdbId",
                table: "Movies",
                columns: new[] { "UserId", "TmdbId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Movies_UserId_TmdbId",
                table: "Movies");
        }
    }
}
