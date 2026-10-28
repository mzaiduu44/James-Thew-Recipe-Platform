using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class addWinnerSubmissionIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WinnerSubmissionId",
                table: "Announcements",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_WinnerSubmissionId",
                table: "Announcements",
                column: "WinnerSubmissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_ContestSubmissions_WinnerSubmissionId",
                table: "Announcements",
                column: "WinnerSubmissionId",
                principalTable: "ContestSubmissions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_ContestSubmissions_WinnerSubmissionId",
                table: "Announcements");

            migrationBuilder.DropIndex(
                name: "IX_Announcements_WinnerSubmissionId",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "WinnerSubmissionId",
                table: "Announcements");
        }
    }
}
