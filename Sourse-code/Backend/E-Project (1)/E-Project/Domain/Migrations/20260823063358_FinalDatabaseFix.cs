using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class FinalDatabaseFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId",
                table: "ContestSubmissions");

            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Users_UserId",
                table: "ContestSubmissions");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Recipes");

            migrationBuilder.AddColumn<int>(
                name: "ContestId1",
                table: "ContestSubmissions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "ContestSubmissions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RecipeImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipeId = table.Column<int>(type: "int", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeImages_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContestSubmissions_ContestId1",
                table: "ContestSubmissions",
                column: "ContestId1");

            migrationBuilder.CreateIndex(
                name: "IX_ContestSubmissions_UserId1",
                table: "ContestSubmissions",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeImages_RecipeId",
                table: "RecipeImages",
                column: "RecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId",
                table: "ContestSubmissions",
                column: "ContestId",
                principalTable: "Contests",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId1",
                table: "ContestSubmissions",
                column: "ContestId1",
                principalTable: "Contests",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Users_UserId",
                table: "ContestSubmissions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Users_UserId1",
                table: "ContestSubmissions",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId",
                table: "ContestSubmissions");

            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId1",
                table: "ContestSubmissions");

            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Users_UserId",
                table: "ContestSubmissions");

            migrationBuilder.DropForeignKey(
                name: "FK_ContestSubmissions_Users_UserId1",
                table: "ContestSubmissions");

            migrationBuilder.DropTable(
                name: "RecipeImages");

            migrationBuilder.DropIndex(
                name: "IX_ContestSubmissions_ContestId1",
                table: "ContestSubmissions");

            migrationBuilder.DropIndex(
                name: "IX_ContestSubmissions_UserId1",
                table: "ContestSubmissions");

            migrationBuilder.DropColumn(
                name: "ContestId1",
                table: "ContestSubmissions");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "ContestSubmissions");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Recipes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Contests_ContestId",
                table: "ContestSubmissions",
                column: "ContestId",
                principalTable: "Contests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContestSubmissions_Users_UserId",
                table: "ContestSubmissions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
