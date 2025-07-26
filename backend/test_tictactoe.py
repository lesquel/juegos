#!/usr/bin/env python3
"""
Script de prueba para verificar que el motor TicTacToe funciona correctamente
"""

from domain.game_engines.tictactoe import TictactoeGame
import json

def test_tictactoe_engine():
    print("🧪 Iniciando test del motor TicTacToe...")
    
    # Crear instancia del motor
    game = TictactoeGame()
    
    # Verificar propiedades básicas
    print(f"📐 Dimensiones del tablero: {game.rows}x{game.columns}")
    print(f"📋 Tablero inicial:")
    for i, row in enumerate(game.board):
        print(f"  Fila {i}: {row} (longitud: {len(row)})")
    
    # Verificar estado inicial
    state = game.get_game_state()
    print(f"\n🎮 Estado inicial del juego:")
    print(f"  Current player: {state['current_player']}")
    print(f"  Move count: {state['move_count']}")
    print(f"  Game over: {state['game_over']}")
    print(f"  Dimensiones del board en estado: {len(state['board'])}x{len(state['board'][0]) if state['board'] else 0}")
    
    # Hacer un movimiento de prueba
    print(f"\n🎯 Haciendo movimiento de prueba...")
    try:
        move_result = game.apply_move({"row": 0, "column": 0})
        print(f"✅ Movimiento exitoso!")
        print(f"  Valid: {move_result['valid']}")
        print(f"  Player: {move_result['player']}")
        print(f"  Move count: {move_result['move_count']}")
        
        # Verificar tablero después del movimiento
        print(f"\n📋 Tablero después del movimiento:")
        for i, row in enumerate(move_result['board']):
            print(f"  Fila {i}: {row} (longitud: {len(row)})")
            
    except Exception as e:
        print(f"❌ Error en movimiento: {e}")
    
    # Verificar el método get_board específico
    board_method = game.get_board()
    print(f"\n🔍 Resultado de get_board():")
    print(f"  Tipo: {type(board_method)}")
    print(f"  Dimensiones: {len(board_method)}x{len(board_method[0]) if board_method else 0}")
    for i, row in enumerate(board_method):
        print(f"  Fila {i}: {row}")

if __name__ == "__main__":
    test_tictactoe_engine()
