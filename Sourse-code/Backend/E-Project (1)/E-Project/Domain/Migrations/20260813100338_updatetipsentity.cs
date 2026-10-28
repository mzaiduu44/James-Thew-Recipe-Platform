using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class updatetipsentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFree",
                table: "Tips");

            migrationBuilder.AddColumn<int>(
                name: "ActionType",
                table: "Tips",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActionType",
                table: "Tips");

            migrationBuilder.AddColumn<bool>(
                name: "IsFree",
                table: "Tips",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
