using Microsoft.EntityFrameworkCore.Migrations;

namespace InfraStructure.Migrations.Store
{
    public partial class interest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "interest",
                table: "OrderItems",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "interest",
                table: "OrderItems");
        }
    }
}
